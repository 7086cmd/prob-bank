import type { BlankContent } from '@/../@types/content'
import type { BlankProblem } from '@/../@types/problem'
import { c2md } from '@/utils/c2md'

export function getBlankAnswerPerProblem(problem: BlankProblem) {
  const content = problem.content.filter(
    (item) => item.type === 'blank'
  ) as BlankContent[]
  let answer = ''
  content.forEach((item: BlankContent) => {
    const result = c2md(item.answer)
    if (result.startsWith('$\\underline{') && result.endsWith('}$')) {
      answer += '$' + result.slice(12, -2) + '$；'
    } else {
      answer += result + '；'
    }
  })
  return answer
}
