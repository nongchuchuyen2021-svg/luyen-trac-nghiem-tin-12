import type { Question } from "./types";
import { tronPhuongAn } from "./tron-phuong-an";

export type ShuffledQuestion = Question & {
  shuffledOptions: string[];
  correctIndex: number;
};

export type QuizSession = {
  quiz: ShuffledQuestion[];
  current: number;
  picked: number | null;
  correctCount: number;
  wrongIds: string[];
  finished: boolean;
};

function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function prepareQuiz(
  questions: readonly Question[],
  random: () => number = Math.random,
): ShuffledQuestion[] {
  return shuffle(questions, random).map((question) => ({
    ...question,
    ...tronPhuongAn(question, random),
  }));
}

export function createQuizSession(
  questions: readonly Question[],
  random: () => number = Math.random,
): QuizSession {
  return {
    quiz: prepareQuiz(questions, random),
    current: 0,
    picked: null,
    correctCount: 0,
    wrongIds: [],
    finished: false,
  };
}

export function retryQuiz(
  questions: readonly Question[],
  random: () => number = Math.random,
): QuizSession {
  return createQuizSession(questions, random);
}

export function answerQuestion(session: QuizSession, index: number): QuizSession {
  const question = session.quiz[session.current];
  if (
    session.finished ||
    session.picked !== null ||
    !question ||
    !Number.isInteger(index) ||
    index < 0 ||
    index >= question.shuffledOptions.length
  ) {
    return session;
  }

  const correct = index === question.correctIndex;
  return {
    ...session,
    picked: index,
    correctCount: session.correctCount + (correct ? 1 : 0),
    wrongIds: correct ? session.wrongIds : [...session.wrongIds, question.id],
  };
}

export function advanceQuiz(session: QuizSession): QuizSession {
  if (session.finished || session.picked === null || !session.quiz[session.current]) {
    return session;
  }
  if (session.current + 1 >= session.quiz.length) {
    return { ...session, finished: true };
  }
  return { ...session, current: session.current + 1, picked: null };
}

export function quizPercent(session: QuizSession): number {
  return session.quiz.length
    ? Math.round((session.correctCount / session.quiz.length) * 100)
    : 0;
}

export function wrongQuestions(session: QuizSession): ShuffledQuestion[] {
  const wrong = new Set(session.wrongIds);
  return session.quiz.filter((question) => wrong.has(question.id));
}
