import type { AllProblem } from "@/../@types/problem";
import { getAnswerPerProblem } from "./getSubAnswer";
import { getOrderText } from "@/utils/orderResult";

export function getAnswer(problem: AllProblem, level: 0 | 1 | 2 = 0) {
  let result = ''
  result += getAnswerPerProblem(problem)
  if (problem.subProblems.length !== 0) {
    problem.subProblems.forEach((item, idx) => {
      const ord = getOrderText({ level: level + 1 as 1 | 2, index: idx + 1 })
      result += `${ord}${getAnswer(item.problem, level + 1 as 1 | 2)}；`
    })
  }
  if (result.endsWith('；') && level === 0) {
    result = result.slice(0, -1)
    result += '．'
  }
  return result.replaceAll('；．', '．').replaceAll('；．', '；').replaceAll('；；', '；').replaceAll('；；', '；')
}
