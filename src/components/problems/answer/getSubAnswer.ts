import type {
  AllProblem,
  JudgeProblem,
  MultipleChoiceProblem,
  SingleChoiceProblem,
} from '@/../@types/problem'
import { getChoiceAnswerPerProblem } from './getChoiceAnswer'
import { getBlankAnswerPerProblem } from './getBlankAnswer'
import { getAnswerAnswerPerProblem } from './getAnswerAnswer'
import type { Content } from '@/../@types/content'

export function getAnswerPerProblem(problem: AllProblem): Content[] {
  if (problem.type.includes('choice') || problem.type === 'judge') {
    return getChoiceAnswerPerProblem(
      problem as SingleChoiceProblem | MultipleChoiceProblem | JudgeProblem
    )
  } else if (problem.type === 'blank') {
    return getBlankAnswerPerProblem(problem)
  } else if (problem.type === 'answer') {
    return getAnswerAnswerPerProblem(problem)
  } else {
    return [
      {
        type: 'text',
        content: 'Unsupported Problem Type',
      },
    ]
  }
}
