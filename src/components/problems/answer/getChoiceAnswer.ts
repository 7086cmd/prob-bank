import type {
  SingleChoiceProblem,
  MultipleChoiceProblem,
  JudgeProblem,
} from '@/../@types/problem.d'

export function getChoiceAnswerPerProblem(
  problem: SingleChoiceProblem | MultipleChoiceProblem | JudgeProblem
) {
  const { answer } = problem
  if (problem.type === 'single-choice') {
    return String.fromCharCode((answer as number) + 65)
  } else if (problem.type === 'multiple-choice' && problem.answer.length === 0) {
    return '$\\varnothing$'
  } else if (problem.type === 'multiple-choice') {
    return (answer as number[])
      .map((x) => String.fromCharCode(x + 65))
      .sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0))
      .join('')
  } else if (problem.type === 'judge') {
    return answer ? 'T' : 'F'
  } else {
    return 'Unsupported Problem Type'
  }
}
