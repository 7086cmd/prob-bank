import { Content } from './content'

export interface Problem {
  _id: string // 由MongoDB自动生成
  type: 'single-choice' | 'multiple-choice' | 'blank' | 'answer' // 题目类型
  origin: string // 题目来源
  content: Content[] // 题目内容
  images?: string[] // 题目图片
  score: number // 题目分值
  details: {
    analytical: Content[]
    procedure: Content[]
    comment: string
    tags: string[]
    points: string[]
  }
  createdAt: string // 创建时间
  updatedAt: string // 更新时间
  data: {
    difficulty: number // 题目难度，范围为 0 ~ 1 (0.1)，以平均分占总分为计，0 表示未知
    referred: number // 题目被引用次数
    level: ['P' | 'J' | 'S' | 'U' | 'V', number] // 题目等级，第一个元素为 P、J、S、U 中的一个，第二个元素为该等级下的序号。其中，P 代表小学，J 代表初中，S 代表高中，V 代表中职，U 代表大学
    subject:
      | 'Chinese'
      | 'Math'
      | 'English'
      | 'Physics'
      | 'Chemistry'
      | 'Biology'
      | 'Politics'
      | 'History'
      | 'Geography'
      | 'Technology'
      | 'Others' // 题目学科
  }
}

export interface SingleChoiceProblem extends Problem {
  type: 'single-choice'
  options: { id: number; content: Content[] }[]
  answer: number // 与 options 中的 id 对应
}

export interface MultipleChoiceProblem extends Problem {
  type: 'multiple-choice'
  options: { id: number; content: Content[] }[]
  answer: number[] // 与 options 中的 id 对应
}

export interface BlankProblem extends Problem {
  type: 'blank'
  answer: Content[]
  subProblems: { id: number; problem: BlankProblem }[]
}

export interface AnswerProblem extends Problem {
  type: 'answer'
  answer: Content[] // 答案
  subProblems: { id: number; problem: AnswerProblem | BlankProblem }[] // 子题目
}
