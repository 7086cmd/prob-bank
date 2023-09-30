import type { BlankContent, Content } from '@/../@types/content'
import type { BlankProblem } from '@/../@types/problem'

export function getBlankAnswerPerProblem(problem: BlankProblem): Content[] {
  const content = problem.content.filter(
    (item) => item.type === 'blank'
  ) as BlankContent[]
  const answer = [] as Content[]
  content.forEach((item: BlankContent) => {
    answer.push(...item.answer.map(x => {
      if (x.type === 'formula') {
        if (x.content.startsWith('\\underline{') && x.content.endsWith('}')) {
          x.content = x.content.slice(11, -1)
        }
      }
      return x
    }))
    answer.push({
      type: 'text',
      content: '；',
    })
  })
  return answer
}
