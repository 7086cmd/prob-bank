// 试卷

import type { Content } from "./content"
import type { AllProblem } from "./problem"
import type { ProblemGroup } from "./problem-group"

export interface Paper {
  _id: string
  metadata: PaperMetadata
  elements: Element[]
}

export interface PaperMetadata {
  level: ['P' | 'J' | 'S' | 'U' | 'V', number]
  subject: string
  name: string
}

export interface ProblemElement {
  type: 'problem-index'
  _id: string
}

export interface ProblemElementSave {
  type: 'problem'
  content: AllProblem
  _id: string
}

export interface ProblemGroupElement {
  type: 'problem-group-index'
  _id: string
}

export interface ProblemGroupElementSave {
  type: 'problem-group'
  content: ProblemGroup
  _id: string
}

export interface DividerElement {
  type: 'divider'
}

export interface PromptElement {
  type: 'prompt'
  problemsCount: number
  score: Array<number>
  description: Content[]
}

export type Element = ProblemElement | ProblemGroupElement | DividerElement | PromptElement | ProblemElementSave | ProblemGroupElementSave