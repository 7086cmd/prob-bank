import type {
  SingleChoiceProblem,
  MultipleChoiceProblem,
  JudgeProblem,
} from '@/../@types/problem.d'
import type { Content } from '@/../@types/content'

export function getChoiceAnswerPerProblem(
  problem: SingleChoiceProblem | MultipleChoiceProblem | JudgeProblem
): Content[] {
  const { answer } = problem
  if (problem.type === 'single-choice') {
    return [
      {
        type: 'text',
        content: String.fromCharCode((answer as number) + 65),
      },
    ]
  } else if (
    problem.type === 'multiple-choice' &&
    problem.answer.length === 0
  ) {
    return [
      {
        type: 'formula',
        content: '\\varnothing',
      },
    ]
  } else if (problem.type === 'multiple-choice') {
    return [
      {
        type: 'text',
        content: (answer as number[])
          .map((x) => String.fromCharCode(x + 65))
          .sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0))
          .join(''),
      },
    ]
  } else if (problem.type === 'judge') {
    return [
      {
        type: 'text',
        content: answer ? 'T' : 'F',
      },
    ]
  } else {
    return [
      {
        type: 'text',
        content: 'Unsupported Problem Type',
      },
    ]
  }
}
