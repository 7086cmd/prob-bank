import type { AnswerProblem } from '@/../@types/problem'
import { c2md } from '@/utils/c2md'

export function getAnswerAnswerPerProblem(problem: AnswerProblem) {
  const answer = problem.answer
  return c2md(answer)
}
