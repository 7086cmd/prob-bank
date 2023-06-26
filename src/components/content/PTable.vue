<script setup lang="ts">
/* global defineProps */
import { toRef } from 'vue'
import { ElImage, ElIcon, ElText, ElTable, ElTableColumn } from 'element-plus'
import type { TableCell, TableContent } from '@/../@types/content'
import PContent from './PContent.vue'

const props = defineProps<{
  content: TableCell[][]
}>()

const content = toRef(props, 'content')

// /*
// export interface TableContent {
//   type: 'table'
//   content: TableCell[][] // 表格内容
// }

// export interface TableCell {
//   content: (TextContent | FormulaContent | ImageContent)[]
//   colspan: number
//   rowspan: number
//   type: 'cell' | 'header'
// }
// */

// // 在 Element Plus 中，表格的数据是通过 columns 和 data 两个属性来进行的，其中 columns 为表头，data 为表格内容。
// // 因此，需要展示表格有以下步骤：
// // 1. 读取表头，生成 columns
// // 2. 读取表格内容，生成 data
// // 3. 读取合并单元格，生成 mergedCells
// // 需要注意的是，是否合并是根据`function({ row, column, rowIndex, columnIndex })`这一既定提供函数进行判断的，因此需要根据(row, column)带入原来的数据中进行判断。

// // 但是显然，一个一个判断带入无法处理大量数据，因此需要首先预处理数据，将合并单元格提取成为以下样式的数组：
// // { start: [row, column], end: [row, column] }[]
// // 之后，再根据这个数组进行判断。

// function preprocessBody(
//   content: TableCell[][]
// ): { start: [number, number]; end: [number, number] }[] {
//   const mergedCells: { start: [number, number]; end: [number, number] }[] = []
//   for (let i = 0; i < content.length; i++) {
//     for (let j = 0; j < content[i].length; j++) {
//       if (content[i][j].colspan > 1 || content[i][j].rowspan > 1) {
//         mergedCells.push({
//           start: [i, j],
//           end: [i + content[i][j].rowspan - 1, j + content[i][j].colspan - 1],
//         })
//       }
//     }
//   }
//   return mergedCells
// }

// // 但是很显然，有些表格是横向的。但是，在这里我们无法显示。因此在非第一行且作为`header`字节时，需要使用粗体。
// // 同时，在对于表格进行预处理时，需要注意多级表头。多级表头，主要通过`header`字节的行数判断，但是注意需要进行对齐，即合并。
// /*

// 数据结构比较复杂的时候，可使用多级表头来展现数据的层次关系。

// 只需要将el-table-column 放置于el-table-column 中，你可以实现组头。

// */
// function preprocessHeader(
//   header: TableCell[][]
// ): { start: [number, number]; end: [number, number] }[] {
//   const mergedCells: { start: [number, number]; end: [number, number] }[] = []
//   for (let i = 0; i < header.length; i++) {
//     for (let j = 0; j < header[i].length; j++) {
//       if (header[i][j].colspan > 1 || header[i][j].rowspan > 1) {
//         mergedCells.push({
//           start: [i, j],
//           end: [i + header[i][j].rowspan - 1, j + header[i][j].colspan - 1],
//         })
//       }
//     }
//   }
//   return mergedCells
// }

// const mergedCells = preprocessBody(content)
// const mergedHeader = preprocessHeader(header)

// const columns = header.map((row, rowIndex) => {
//   return row.map((cell, columnIndex) => {
//     return {
//       label: cell.content
//         .map((content) => {
//           if (content.type === 'text') {
//             return content.content
//           } else {
//             return ''
//           }
//         })
//         .join(''),
//       rowspan: cell.rowspan,
//       colspan: cell.colspan,
//       align: 'center',
//       key: `${rowIndex}-${columnIndex}`,
//     }
//   })
// })

// const data = content.map((row, rowIndex) => {
//   return row.map((cell, columnIndex) => {
//     return {
//       content: cell.content,
//       rowspan: cell.rowspan,
//       colspan: cell.colspan,
//       align: 'center',
//       key: `${rowIndex}-${columnIndex}`,
//     }
//   })
// })

// const mergedCellsData = mergedCells.map((cell) => {
//   return {
//     start: cell.start,
//     end: cell.end,
//   }
// })

// const mergedHeaderData = mergedHeader.map((cell) => {
//   return {
//     start: cell.start,
//     end: cell.end,
//   }
// })

// // 由于 Element Plus 的表格组件，需要通过`function({ row, column, rowIndex, columnIndex })`来判断是否需要合并单元格，因此需要根据这个函数来进行判断。

// function rowspanMethod({
//   rowIndex,
//   columnIndex,
// }: {
//   rowIndex: number
//   columnIndex: number
// }) {
//   // 这时候，我们就可以通过预处理生成的数据进行快速比对判断。

//   // 表头的判断在这里完全不需要，因为表头的合并应当体现在 标签 中。

//   // 但是，对于表格内容，需要进行判断。

//   mergedCellsData.forEach(({ start, end }) => {
//     if (start[0] === end[0] && start[0] === rowIndex) {
//       if (start[1] <= columnIndex && columnIndex <= end[1]) {
//         return {
//           rowspan: end[1] - start[1] + 1,
//           colspan: 1,
//         }
//       }
//     } else if (start[1] === end[1] && start[1] === columnIndex) {
//       if (start[0] <= rowIndex && rowIndex <= end[0]) {
//         return {
//           rowspan: 1,
//           colspan: end[0] - start[0] + 1,
//         }
//       }
//     } else
//       return {
//         rowspan: 1,
//         colspan: 1,
//       }
//   })
// }
console.log(content)
</script>

<template>
  <table class="table-fixed caption-top border-collapse">
    <tbody>
      <tr v-for="item in content" :key="item.toString()">
        <td
          v-for="cell in item"
          class="border border-slate-300 px-6 py-1"
          :key="cell.toString()"
          :rowspan="cell.rowspan"
          :colspan="cell.colspan"
        >
          <th v-if="cell.type === 'header'">
            <PContent :content="cell.content" />
          </th>
          <span v-else>
            <PContent :content="cell.content" />
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>
