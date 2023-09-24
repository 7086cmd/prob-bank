import { getProblem } from '@/api'

import { getAnswer } from './answer/getAnswer'
import type { AllProblem } from '@/../@types/problem'

export async function getAnswerById(id: string) {
  const problem = await getProblem(id)
  return getAnswer(problem as AllProblem)
}

export { getAnswer }
