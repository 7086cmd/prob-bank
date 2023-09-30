import type { AllProblem } from '@/../@types/problem'
import type { TextContent, Content } from '@/../@types/content'

export function problemHandler(prob: AllProblem) {
  function deleteQuotesInChoice(problem: AllProblem) {
    if (
      problem.type === 'single-choice' ||
      problem.type === 'multiple-choice' ||
      problem.type === 'judge'
    ) {
      problem.content.map((item) => {
        if (item.type === 'text' && item.content.endsWith('（　　）')) {
          item.content = item.content.slice(0, -4)
        }
        return item
      })
    }
    problem.subProblems.map((item) => {
      item.problem = deleteQuotesInChoice(item.problem)
    })
    return problem
  }
  function handleSemiAndComma(problem: AllProblem, useSemi = true) {
    function addSignal(
      content: Content[],
      signal: '；' | '．' = '．',
      mode: 'add' | 'delete' = 'add'
    ) {
      const unsignal = signal === '．' ? '；' : '．'
      const idx =
        content.length -
        content
          .reverse()
          .findIndex(
            (item) => item.type === 'text' || item.type === 'formula'
          ) -
        1
      content.reverse()
      if (!content[idx]) return content
      if (
        content[idx].type === 'text' &&
        !(content[idx] as TextContent).content.endsWith(signal)
      ) {
        if ((content[idx] as TextContent).content.endsWith(unsignal))
          (content[idx] as TextContent).content.slice(0, -1)
        if (mode === 'add' && content[idx].type === 'text')
          (content[idx] as TextContent).content += signal
        else if (mode === 'add' && content[idx].type === 'formula')
          // 添加一个 Text Content
          content.splice(idx, 0, {
            type: 'text',
            content: signal,
          })
      }
      return content
    }
    if (!problem.type.includes('choice'))
      problem.content = addSignal(problem.content, useSemi ? '；' : '．')
    if (problem.type === 'answer') {
      problem.answer = addSignal(problem.answer, '．', 'delete')
      problem.answer = addSignal(problem.answer, '；', 'delete')
    }
    problem.subProblems.map((item, index) => {
      item.problem = handleSemiAndComma(
        item.problem,
        index !== problem.subProblems.length - 1
      )
      return item
    })
    return problem
  }
  return handleSemiAndComma(deleteQuotesInChoice(prob), false)
}
