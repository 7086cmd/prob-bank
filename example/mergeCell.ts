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

export interface TableCell {
  content: (TextContent | FormulaContent | ImageContent)[]
  colspan: number
  rowspan: number
  type: 'cell' | 'header'
}

const content = [
  [
    {
      content: [
        {
          type: 'text',
          content: '姓名',
        },
      ],
      colspan: 1,
      rowspan: 1,
      type: 'header',
    },
    {
      content: [
        {
          type: 'text',
          content: '年龄',
        },
      ],
      colspan: 1,
      rowspan: 1,
      type: 'header',
    },
    {
      content: [
        {
          type: 'text',
          content: '性别',
        },
      ],
      colspan: 1,
      rowspan: 1,
      type: 'header',
    },
  ],
  [
    {
      content: [
        {
          type: 'text',
          content: '张三',
        },
      ],
      colspan: 1,
      rowspan: 1,
      type: 'cell',
    },
    {
      content: [
        {
          type: 'text',
          content: '18',
        },
      ],
      colspan: 1,
      rowspan: 1,
      type: 'cell',
    },
    {
      content: [
        {
          type: 'text',
          content: '男',
        },
      ],
      colspan: 1,
      rowspan: 2,
      type: 'cell',
    },
  ],
  [
    {
      content: [
        {
          type: 'text',
          content: '李四',
        },
      ],
      colspan: 1,
      rowspan: 1,
      type: 'cell',
    },
    {
      content: [
        {
          type: 'text',
          content: '20',
        },
      ],
      colspan: 1,
      rowspan: 1,
      type: 'cell',
    },
  ],
]
const mergedCells: [number, number][] = []
for (let row = 0; row < content.length; row++) {
  for (let column = 0; column < content[row].length; column++) {
    const cell = content[row][column]
    if (cell.colspan > 1 || cell.rowspan > 1) {
      mergedCells.push([row, column])
    }
  }
}

console.log(mergedCells)
