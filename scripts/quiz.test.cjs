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
const {
  advanceQuiz,
  answerQuestion,
  createQuizSession,
  prepareQuiz,
  quizPercent,
  retryQuiz,
  wrongQuestions,
} = require('../lib/quiz-engine.ts');

function question(id, overrides = {}) {
  return {
    id,
    q: `Câu hỏi ${id}?`,
    options: ['Phương án A', 'Phương án B', 'Phương án C', 'Phương án D'],
    answer: 2,
    explain: 'Giải thích.',
    ...overrides,
  };
}

const alwaysZero = () => 0;

test('prepareQuiz shuffles question order and keeps each correct answer mapped to its option', () => {
  const source = [question('q1'), question('q2'), question('q3')];
  const before = JSON.stringify(source);
  const quiz = prepareQuiz(source, alwaysZero);

  assert.deepEqual(quiz.map((item) => item.id), ['q2', 'q3', 'q1']);
  assert.equal(new Set(quiz.map((item) => item.id)).size, source.length);
  for (const item of quiz) {
    assert.equal(item.shuffledOptions.length, 4);
    assert.equal(new Set(item.shuffledOptions).size, 4);
    assert.equal(item.shuffledOptions[item.correctIndex], item.options[item.answer]);
  }
  assert.equal(JSON.stringify(source), before, 'preparing a quiz must not mutate the question bank');
});

test('prepareQuiz shuffles ordinary options but preserves questions with positional answers', () => {
  const ordinary = question('ordinary');
  const explicitlyFixed = question('fixed', { shuffleOptions: false });
  const labelDependent = question('label-dependent', {
    q: 'Đáp án A đúng vì lí do nào?',
  });
  const quiz = prepareQuiz([ordinary, explicitlyFixed, labelDependent], alwaysZero);
  const byId = new Map(quiz.map((item) => [item.id, item]));

  assert.notDeepEqual(byId.get('ordinary').shuffledOptions, ordinary.options);
  assert.deepEqual(byId.get('fixed').shuffledOptions, explicitlyFixed.options);
  assert.deepEqual(byId.get('label-dependent').shuffledOptions, labelDependent.options);
  for (const source of [ordinary, explicitlyFixed, labelDependent]) {
    const item = byId.get(source.id);
    assert.equal(item.shuffledOptions[item.correctIndex], source.options[source.answer]);
  }
});

test('answer and advance transitions score once, track wrong answers, and finish only after the last question', () => {
  const initial = createQuizSession([question('q1'), question('q2')], alwaysZero);
  const first = initial.quiz[initial.current];
  const wrong = (first.correctIndex + 1) % first.shuffledOptions.length;
  const afterWrong = answerQuestion(initial, wrong);

  assert.equal(afterWrong.picked, wrong);
  assert.equal(afterWrong.correctCount, 0);
  assert.deepEqual(afterWrong.wrongIds, [first.id]);
  assert.strictEqual(answerQuestion(afterWrong, first.correctIndex), afterWrong, 'a second selection is ignored');

  const secondQuestion = advanceQuiz(afterWrong);
  assert.equal(secondQuestion.current, 1);
  assert.equal(secondQuestion.picked, null);
  assert.equal(secondQuestion.finished, false);

  const second = secondQuestion.quiz[secondQuestion.current];
  const afterCorrect = answerQuestion(secondQuestion, second.correctIndex);
  assert.equal(afterCorrect.correctCount, 1);
  assert.deepEqual(afterCorrect.wrongIds, [first.id]);

  const finished = advanceQuiz(afterCorrect);
  assert.equal(finished.finished, true);
  assert.equal(quizPercent(finished), 50);
  assert.deepEqual(wrongQuestions(finished).map((item) => item.id), [first.id]);
  assert.strictEqual(advanceQuiz(finished), finished, 'a finished quiz cannot advance again');
});

test('invalid selections do not change state, and retry resets progress with a new quiz order', () => {
  const source = [question('q1'), question('q2')];
  const initial = createQuizSession(source, alwaysZero);
  assert.strictEqual(answerQuestion(initial, -1), initial);
  assert.strictEqual(answerQuestion(initial, 4), initial);
  assert.strictEqual(advanceQuiz(initial), initial, 'cannot skip an unanswered question');

  const answered = answerQuestion(initial, initial.quiz[0].correctIndex);
  const retried = retryQuiz(source, () => 0.99);
  assert.notDeepEqual(retried.quiz.map((item) => item.id), initial.quiz.map((item) => item.id));
  assert.equal(retried.current, 0);
  assert.equal(retried.picked, null);
  assert.equal(retried.correctCount, 0);
  assert.deepEqual(retried.wrongIds, []);
  assert.equal(retried.finished, false);
  assert.equal(quizPercent(answered), 50);
});
