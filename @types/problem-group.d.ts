import { Content } from './content'
import { AllProblem } from './problem'

export interface RemovableProblemGroup {
  _id: string // 由 MongoDB 自动生成的 ID，在后端类型为 ObjectId
  type: 'removable'
  prompts: Content[] // 一般而言，题组的用处是先显示材料（提示），再按照原顺序显示题目
  problems: string[] // RemovableProblem 要求所有题目本身必须在数据库中存在，因此这里存储的是题目的 _id
  createdAt: string // 创建时间
  updatedAt: string // 更新时间
  data: {
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
      | 'IT'
      | 'General Technology'
      | 'Others' // 题目学科
    origin: string // 题目来源
    level: ['P' | 'J' | 'S' | 'U' | 'V', number] // 题目等级，第一个元素为 P、J、S、U 中的一个，第二个元素为该等级下的序号。其中，P 代表小学，J 代表初中，S 代表高中，V 代表中职，U 代表大学
    difficulty: number // 题目难度，范围为 0 ~ 1 (0.1)，以平均分占总分为计，0 表示未知
    referred: number // 题目被引用次数
  }
}

export interface UnremovableProblemGroup {
  // 类似阅读等类型
  _id: string
  type: 'unremovable'
  prompts: Content[]
  problems: AllProblem[] // UnremovableProblem 中，不允许题目单独加到“problem“ 这一 collection ，因此，在这里存储的是 Problem 对象
  createdAt: string // 创建时间
  updatedAt: string // 更新时间
  data: {
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
      | 'IT'
      | 'General Technology'
      | 'Others' // 题目学科
    origin: string // 题目来源
    level: ['P' | 'J' | 'S' | 'U' | 'V', number] // 题目等级，第一个元素为 P、J、S、U 中的一个，第二个元素为该等级下的序号。其中，P 代表小学，J 代表初中，S 代表高中，V 代表中职，U 代表大学
    difficulty: number // 题目难度，范围为 0 ~ 1 (0.1)，以平均分占总分为计，0 表示未知
    referred: number // 题目被引用次数
  }
}

export type ProblemGroup =
  | RemovableProblemGroup
  | (UnremovableProblemGroup & {
      _id: string
      createdAt: string // 创建时间
      updatedAt: string // 更新时间
      data: {
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
          | 'IT'
          | 'General Technology'
          | 'Others' // 题目学科
        origin: string // 题目来源
        level: ['P' | 'J' | 'S' | 'U' | 'V', number] // 题目等级，第一个元素为 P、J、S、U 中的一个，第二个元素为该等级下的序号。其中，P 代表小学，J 代表初中，S 代表高中，V 代表中职，U 代表大学
        difficulty: number // 题目难度，范围为 0 ~ 1 (0.1)，以平均分占总分为计，0 表示未知
        referred: number // 题目被引用次数
      }
    })
