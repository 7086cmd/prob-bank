# 类型声明：内容

其中，`Content`是一个`type`，可分为`text`、`formula`、`image`、`table`，用于描述题目的内容。

```typescript
declare interface TextContent {
  type: 'text'
  content: string
}

declare interface FormulaContent {
  type: 'formula'
  content: string
}

declare interface ImageContent {
  type: 'image'
  content: string // Base64 编码
}

declare interface TableContent {
  type: 'table'
  content: string[][] // 表格内容
}

declare type Content = (
  | TextContent
  | FormulaContent
  | ImageContent
  | TableContent
)[]
```
