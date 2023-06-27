export interface TextContent {
  type: 'text'
  content: string
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

export interface TableCell {
  content: (TextContent | FormulaContent | ImageContent | BlankContent)[]
  colspan?: number
  rowspan?: number
  type: 'cell' | 'header'
}

export type Content = TextContent | FormulaContent | ImageContent | TableContent | BlankContent

export type Contents = Content[]
