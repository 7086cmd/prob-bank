import type { AllProblem } from '@/../@types/problem'
import type { Element } from '@/../@types/paper'
import type { Content, TableCell } from '@/../@types/content'
import { getAnswer } from '../problems/answer'
import { getProblem, getProblemGroup } from '@/api'

export async function getAnswerInPaper(elements: Element[]) {
  const probs = [] as {
    id: number
    type: AllProblem['type']
    answer: Content[]
  }[]
  elements.forEach(async (item) => {
    if (item.type === 'problem') {
      probs.push({
        id: probs.length,
        type: item.content.type,
        answer: getAnswer(item.content),
      })
    } else if (item.type === 'problem-index') {
      const result = await getProblem(item._id)
      probs.push({
        id: probs.length,
        type: result?.type as AllProblem['type'],
        answer: getAnswer(result as AllProblem),
      })
    } else if (item.type === 'problem-group') {
      if (item.content.type === 'removable') {
        item.content.problems.forEach(async (prob) => {
          const result = await getProblem(prob)
          probs.push({
            id: probs.length,
            type: result?.type as AllProblem['type'],
            answer: getAnswer(result as AllProblem),
          })
        })
      } else {
        item.content.problems.forEach((prob) => {
          probs.push({
            id: probs.length,
            type: prob.type,
            answer: getAnswer(prob as AllProblem),
          })
        })
      }
    } else if (item.type === 'problem-group-index') {
      const result = await getProblemGroup(item._id)
      if (result?.type === 'removable') {
        result.problems.forEach(async (prob) => {
          const result = await getProblem(prob)
          probs.push({
            id: probs.length,
            type: result?.type as AllProblem['type'],
            answer: getAnswer(result as AllProblem),
          })
        })
      } else {
        result?.problems.forEach((prob) => {
          probs.push({
            id: probs.length,
            type: prob.type,
            answer: getAnswer(prob as AllProblem),
          })
        })
      }
    }
  })
  return probs
}

export function classifyAnwersByType(
  resp: {
    id: number
    type: AllProblem['type']
    answer: Content[]
  }[]
) {
  const answers = {
    judge: resp.filter((item) => item.type === 'judge'),
    'single-choice': resp.filter((item) => item.type === 'single-choice'),
    'multiple-choice': resp.filter((item) => item.type === 'multiple-choice'),
    blank: resp.filter((item) => item.type === 'blank'),
    answer: resp.filter((item) => item.type === 'answer'),
  }
  const result: Content[] = []
  function intoTable(
    arr: {
      id: number
      answer: Content[]
    }[],
    baseord: number = 0
  ) {
    console.log(arr, '2')
    const base = [] as TableCell[][]
    for (let idx = 0; 8 * idx < arr.length; idx++) {
      base.push([
        {
          content: [
            {
              type: 'text',
              content: '序号',
            },
          ],
          type: 'header',
        },
      ])
      base.push([
        {
          content: [
            {
              type: 'text',
              content: '答案',
            },
          ],
          type: 'header',
        },
      ])
      arr.forEach((item, index) => {
        if (index >= idx * 8 && index < (idx + 1) * 8) {
          console.log(2 * idx + 1, 2 * idx + 2, 'sdf')
          base[2 * idx].push({
            content: [
              {
                type: 'text',
                content: `${index + baseord + 1}`,
              },
            ],
            type: 'header',
          })
          base[2 * idx + 1].push({
            content: item.answer,
            type: 'cell',
          })
        }
      })
    }
    return base
  }
  if (answers.judge.length) {
    result.push({
      type: 'text',
      content: '判断题',
    })
    result.push({
      type: 'table',
      content: intoTable(answers.judge, 0),
    })
  }
  if (answers['single-choice'].length) {
    result.push({
      type: 'text',
      content: '单选题',
    })
    result.push({
      type: 'table',
      content: intoTable(answers['single-choice'], answers.judge.length),
    })
  }
  if (answers['multiple-choice'].length) {
    result.push({
      type: 'text',
      content: '多选题',
    })
    result.push({
      type: 'table',
      content: intoTable(
        answers['multiple-choice'],
        answers.judge.length + answers['single-choice'].length
      ),
    })
  }
  if (answers.blank) {
    result.push({
      type: 'text',
      content: '填空题',
    })
    result.push({
      type: 'divider',
    })
    answers.blank.forEach((x) => {
      result.push({
        type: 'text',
        content: x.id + 1 + '．',
      })
      result.push(...x.answer)
      result.push({
        type: 'divider',
      })
    })
  }
  if (answers.answer.length) {
    result.push({
      type: 'text',
      content: '解答题',
    })
    result.push({
      type: 'divider',
    })
    answers.answer.forEach((x) => {
      result.push({
        type: 'text',
        content: x.id + 1 + '．',
      })
      result.push(...x.answer)
      result.push({
        type: 'divider',
      })
    })
  }
  return result
}
