const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const resolve = Module._resolveFilename;
Module._resolveFilename = function (name, ...args) {
  return resolve.call(this, name.startsWith('@/') ? path.join(root, name.slice(2)) : name, ...args);
};
require.extensions['.ts'] = (mod, file) => mod._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
}).outputText, file);
// Tests never contact a real Redis instance or alter deployment configuration.
for (const key of ['VERCEL', 'UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN', 'KV_REST_API_URL', 'KV_REST_API_TOKEN']) delete process.env[key];
const { POST } = require('../app/api/room/route.ts');
const { readRoom, replaceRoom } = require('../lib/room-store.ts');
const question = { id: 'test-1', question: 'Câu thử', options: ['A', 'B', 'C', 'D'], correctAnswer: 0, explanation: 'A đúng.' };
async function call(body) {
  const res = await POST(new Request('http://localhost/api/room', { method: 'POST', body: JSON.stringify(body) }));
  return { status: res.status, ...await res.json() };
}
async function fixture(count = 1, length = 3) {
  const room = await call({ action: 'create', questions: Array.from({ length }, (_, i) => ({ ...question, id: `test-${i}` })), roundTime: 5 });
  assert.equal(room.ok, true);
  const players = [];
  for (let i = 0; i < count; i++) players.push(await call({ action: 'join', pin: room.pin, name: `HS ${i}` }));
  const host = (type, questionIndex = 0) => call({ action: 'hostAction', pin: room.pin, hostSecret: room.hostSecret, type, questionIndex });
  const state = () => call({ action: 'state', pin: room.pin });
  const answer = (p, choice = 0, questionIndex = 0, extra = {}) => call({ action: 'answer', pin: room.pin, playerId: p.playerId, playerSecret: p.playerSecret, choice, questionIndex, ...extra });
  return { room, players, host, state, answer };
}
test('a revealed round is scored once, including concurrent reveal requests', async () => {
  const f = await fixture(); await f.host('start');
  await f.answer(f.players[0]);
  await Promise.all(Array.from({ length: 5 }, () => f.host('reveal')));
  const s = await f.state(); assert.equal(s.players[0].score, 150); assert.equal(s.players[0].correctCount, 1);
});
test('player IDs alone cannot submit or reveal another player answer', async () => {
  const f = await fixture(2); await f.host('start');
  assert.equal((await f.answer(f.players[0], 0, 0, { playerSecret: f.players[1].playerSecret })).status, 403);
  assert.equal((await f.answer(f.players[0], 0, 0, { playerSecret: undefined })).status, 403);
  assert.equal((await call({ action: 'answer', pin: f.room.pin, playerId: '__proto__', choice: 0, questionIndex: 0 })).status, 403);
  await f.answer(f.players[0]);
  const s = await call({ action: 'state', pin: f.room.pin, playerId: f.players[0].playerId });
  assert.equal(s.players[0].currentChoice, null); assert.equal(s.question.correctAnswer, undefined);
  assert.equal(JSON.stringify(s).includes(f.players[0].playerSecret), false);
  assert.equal(JSON.stringify(s).includes(f.room.hostSecret), false);
});
test('elapsed time is measured by the server, ignoring forged client time', async () => {
  const f = await fixture(); await f.host('start');
  await f.answer(f.players[0], 0, 0, { timeMs: -100 });
  assert.ok((await f.state()).players[0].timeMs >= 0);
});
test('deadline closes the round and rejects a late answer', async () => {
  const f = await fixture(); await f.host('start');
  const raw = await readRoom(f.room.pin), room = JSON.parse(raw);
  room.roundStartTime = Date.now() - 6000; await replaceRoom(f.room.pin, raw, room);
  assert.equal((await f.answer(f.players[0])).ok, false);
  const s = await f.state(); assert.equal(s.status, 'revealed'); assert.equal(s.players[0].correctCount, 0);
});
test('simultaneous answers are retained and score each player once', async () => {
  const f = await fixture(40); await f.host('start');
  const results = await Promise.all(f.players.map(p => f.answer(p)));
  assert.ok(results.every(r => r.ok));
  const s = await f.state(); assert.equal(s.status, 'revealed');
  assert.ok(s.players.every(p => p.correctCount === 1));
  assert.equal(s.players.filter(p => p.score === 150).length, 1);
});
test('stale answers and duplicate next commands cannot affect the following round', async () => {
  const f = await fixture(); await f.host('start'); await f.answer(f.players[0]);
  const results = await Promise.all([f.host('next'), f.host('next')]);
  assert.equal(results.filter(r => r.ok).length, 1);
  assert.equal((await f.state()).currentQIndex, 1);
  assert.equal((await f.answer(f.players[0], 0, 0)).status, 409);
  assert.equal((await f.host('start', 1)).ok, true);
  assert.equal((await f.state()).currentQIndex, 1);
});
test('invalid input, empty questions and unauthorized host commands are rejected', async () => {
  assert.equal((await call(null)).status, 400);
  assert.equal((await call({ action: 'create', questions: [] })).status, 400);
  assert.equal((await call({ action: 'create', questions: [question], roundTime: -1 })).status, 400);
  const f = await fixture(); await f.host('start');
  assert.equal((await f.answer(f.players[0], 7)).status, 400);
  assert.equal((await call({ action: 'hostAction', pin: f.room.pin, hostSecret: 'wrong', type: 'reveal', questionIndex: 0 })).status, 403);
  assert.equal((await call({ action: 'join', pin: f.room.pin, name: 'Late' })).ok, false);
});
test('Redis snapshots are shared between independent module instances and use atomic CAS', async () => {
  const originalFetch = global.fetch, values = new Map(), commands = [];
  process.env.UPSTASH_REDIS_REST_URL = 'https://redis.test';
  process.env.UPSTASH_REDIS_REST_TOKEN = 'test-only';
  global.fetch = async (_url, init) => {
    const a = JSON.parse(init.body); commands.push(a);
    let result = null;
    if (a[0] === 'GET') result = values.get(a[1]) ?? null;
    if (a[0] === 'SET' && !values.has(a[1])) { values.set(a[1], a[2]); result = 'OK'; }
    if (a[0] === 'EVAL') { result = values.get(a[3]) === a[4] ? 1 : 0; if (result) values.set(a[3], a[5]); }
    return Response.json({ result });
  };
  try {
    const file = require.resolve('../lib/room-store.ts');
    delete require.cache[file]; const a = require(file);
    delete require.cache[file]; const b = require(file);
    assert.equal(await a.createRoom('123456', { value: 1 }), true);
    assert.equal(await b.createRoom('123456', { value: 2 }), false);
    const initial = await b.readRoom('123456'); assert.equal(JSON.parse(initial).value, 1);
    assert.equal(await a.replaceRoom('123456', initial, { value: 2 }), true);
    assert.equal(await b.replaceRoom('123456', initial, { value: 3 }), false);
    assert.equal(JSON.parse(await b.readRoom('123456')).value, 2);
    assert.ok(commands.find(c => c[0] === 'SET' && c.includes('EX') && c.includes(10800)));
    delete process.env.UPSTASH_REDIS_REST_URL; delete process.env.UPSTASH_REDIS_REST_TOKEN;
    process.env.VERCEL = '1';
    await assert.rejects(b.readRoom('123456'), /ROOM_STORAGE_NOT_CONFIGURED/);
  } finally {
    global.fetch = originalFetch;
    delete process.env.UPSTASH_REDIS_REST_URL; delete process.env.UPSTASH_REDIS_REST_TOKEN; delete process.env.VERCEL;
  }
});
