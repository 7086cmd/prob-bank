import type { AllProblem, MultipleChoiceProblem, SingleChoiceProblem } from '@/../@types/problem'
import { getChoiceAnswerPerProblem } from './getChoiceAnswer'
import { getBlankAnswerPerProblem } from './getBlankAnswer'
import { getAnswerAnswerPerProblem } from './getAnswerAnswer'

export function getAnswerPerProblem(problem: AllProblem) {
  if (problem.type.includes('choice')) {
    return getChoiceAnswerPerProblem((problem as SingleChoiceProblem | MultipleChoiceProblem))
  } else if (problem.type === 'blank') {
    return getBlankAnswerPerProblem(problem)
  } else if (problem.type === 'answer') {
    return getAnswerAnswerPerProblem(problem)
  } else {
    return 'Unsupported Problem Type: ' + problem.type
  }
}
