import { questions } from '../data/questions';
import { shuffleQuestions } from '../utils/shuffleQuestions';

export function getQuizQuestions(materia?: string, dificuldade?: string) {
  let filtered = questions;

  if (materia) {
    filtered = filtered.filter((q) => q.materia === materia);
  }

  if (dificuldade) {
    filtered = filtered.filter((q) => q.dificuldade === dificuldade);
  }

  return shuffleQuestions(filtered).slice(0, 15);
}