import { Problem } from './problem'

export interface ProblemGroup {
  type: 'group'
  title: string // 题组标题
  removable: boolean // 是否可删除
  problems: (Problem | Omit<Problem, '_id'>)[] // 题目列表
}

export interface RemovableProblemGroup extends ProblemGroup {
  removable: true
  problems: Problem[]
}

export interface UnremovableProblemGroup extends ProblemGroup {
  removable: false
  problems: Omit<Problem, '_id'>[]
}
