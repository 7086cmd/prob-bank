import type { AllProblem } from './problem'

export interface TextContent {
  type: 'text'
  content: string
}

export interface TextareaContent {
  type: 'textarea'
  content: string
  attrib: 'normal' | 'quote' | 'command' | 'origin'
}

export interface FormulaContent {
  type: 'formula'
  content: string
}

export interface ImageContent {
  type: 'image'
  src: string
  alt: string
}

export interface TableContent {
  type: 'table'
  content: TableCell[][] // 表格内容
}

export interface BlankContent {
  type: 'blank'
  answer: Content[]
}

export interface MaterialContent {
  type: 'material'
  material: {
    label: string
    origin?: string
    content: Content[]
  }
}

export interface ArticleContent {
  type: 'article'
  article: {
    title: string
    author: string
    content: string[]
    align: 'left' | 'center'
    language: 'zh' | 'en'
  }
}

export interface ProblemContent {
  type: 'problem'
  problem: AllProblem
}

export interface ListContent {
  type: 'list'
  classify: 'ordered' | 'unordered'
  contents: Content[][]
}

export interface CodeContent {
  type: 'code'
  language: string
  content: string
}

export interface DividerContent {
  type: 'divider'
}

export interface TableCell {
  content: Content[]
  colspan?: number
  rowspan?: number
  type: 'cell' | 'header'
}

export type Content =
  | TextContent
  | FormulaContent
  | ImageContent
  | TableContent
  | BlankContent
  | TextareaContent
  | MaterialContent
  | CodeContent
  | DividerContent
  | ArticleContent
  | ProblemContent
  | ListContent

export type Contents = Content[]
