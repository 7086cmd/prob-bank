import type { AllProblem, JudgeProblem, MultipleChoiceProblem, SingleChoiceProblem } from '@/../@types/problem'
import { getChoiceAnswerPerProblem } from './getChoiceAnswer'
import { getBlankAnswerPerProblem } from './getBlankAnswer'
import { getAnswerAnswerPerProblem } from './getAnswerAnswer'

export function getAnswerPerProblem(problem: AllProblem) {
  if (problem.type.includes('choice') || problem.type === 'judge') {
    return getChoiceAnswerPerProblem((problem as SingleChoiceProblem | MultipleChoiceProblem | JudgeProblem))
  } else if (problem.type === 'blank') {
    return getBlankAnswerPerProblem(problem)
  } else if (problem.type === 'answer') {
    return getAnswerAnswerPerProblem(problem)
  } else {
    return 'Unsupported Problem Type: ' + problem.type
  }
}
