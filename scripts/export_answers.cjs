const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (name, ...args) {
  return originalResolve.call(
    this,
    name.startsWith('@/') ? path.join(root, name.slice(2)) : name,
    ...args
  );
};

require.extensions['.ts'] = (mod, file) =>
  mod._compile(
    ts.transpileModule(fs.readFileSync(file, 'utf8'), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
      },
    }).outputText,
    file
  );

const { REVIEW_MC, REVIEW_TF, REVIEW_ESSAYS } = require('../data/review-1-8.ts');

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

const mcAnswers = REVIEW_MC.map((q, idx) => ({
  index: idx + 1,
  id: q.id,
  lesson: q.lesson,
  level: q.level,
  answerLetter: OPTION_LABELS[q.answer],
  answerText: q.options[q.answer],
  explain: q.explain,
}));

const tfAnswers = REVIEW_TF.map((q, idx) => ({
  index: idx + 1,
  id: q.id,
  lesson: q.lesson,
  level: q.level,
  statements: q.statements.map((s, sIdx) => ({
    label: ['a', 'b', 'c', 'd'][sIdx],
    answer: s.answer ? 'Đúng' : 'Sai',
    explain: s.explain,
  })),
}));

const essayAnswers = REVIEW_ESSAYS.map((q, idx) => ({
  index: idx + 1,
  id: q.id,
  lesson: q.lesson,
  level: q.level,
  prompt: q.q,
  answer: q.answer,
  rubric: q.rubric,
}));

fs.writeFileSync(
  path.join(root, 'tmp', 'review_answers.json'),
  JSON.stringify({ mc: mcAnswers, tf: tfAnswers, essay: essayAnswers }, null, 2),
  'utf8'
);

console.log('Successfully generated tmp/review_answers.json');
