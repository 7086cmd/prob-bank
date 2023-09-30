import type { AnswerProblem } from '@/../@types/problem'
import type { Content } from '@/../@types/content'

export function getAnswerAnswerPerProblem(problem: AnswerProblem): Content[] {
  const answer = problem.answer
  return answer
}
