import type { AllProblem } from '@/../@types/problem'
import { getAnswerPerProblem } from './getSubAnswer'
import { getOrderText } from '@/utils/orderResult'
import type { Content, TextContent } from '@/../@types/content'
import { isRef, unref, type Ref } from 'vue'

export function getAnswer(problem: AllProblem, level: 0 | 1 | 2 = 0) {
  const result = [] as Content[]
  result.push(...getAnswerPerProblem(problem))
  if (problem.subProblems.length !== 0) {
    problem.subProblems.forEach((item, idx) => {
      const ord = getOrderText({ level: (level + 1) as 1 | 2, index: idx + 1 })
      if (ord)
        result.push({
          type: 'text',
          content: ord,
        })
      const res = getAnswer(item.problem, (level + 1) as 1 | 2) as
        | Content[]
        | Ref<Content[]>
      if (isRef(res)) result.push(...unref(res as Ref<Content[]>))
      else result.push(...res)
      result.push({
        type: 'text',
        content: idx === problem.subProblems.length - 1 ? '．' : '；',
      })
      if (level === 0)
        result.push({
          type: 'divider',
        })
    })
  }
  return result.filter((el, idx, arr) => {
    const isCommaOrDivider =
      el.type === 'text' && (el.content === '．' || el.content === '；')
    const isLastCommaOrDivider = idx === arr.length - 1 && isCommaOrDivider
    const isLastDivider = idx === arr.length - 1 && el.type === 'divider'
    const isLastText = idx === arr.length - 1 && el.type === 'text'
    const isLastTextContentEmpty =
      isLastText && (el as TextContent).content === ''
    const isLast =
      isLastCommaOrDivider || isLastDivider || isLastTextContentEmpty
    return !isLast
  })
}
