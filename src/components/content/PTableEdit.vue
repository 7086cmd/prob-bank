<script setup lang="ts">
import { toRefs, ref, watch, isRef } from 'vue'
import type { TableCell } from '@/../@types/content'
import PContent from './PContent.vue'
import { ElButton, ElDrawer, ElForm, ElFormItem, ElInput } from 'element-plus'
import { Check } from '@element-plus/icons-vue'
import PTableCellEdit from './PTableCellEdit.vue'

const props = defineProps<{
  modelValue: TableCell[][]
  editable: boolean
}>()

const emits = defineEmits(['update:modelValue'])

const { modelValue, editable } = toRefs(props)

const cells = ref<TableCell[][]>(modelValue.value)

function countSize(table: TableCell[][]) {
  const counts = table.map((row) => row.length)
  return {
    row: counts.length,
    col: Math.max(...counts),
  }
}

const mdsrc = ref('')

function importFromMarkdown(md: string) {
  const lines = md.split('\n')
  const result = lines
    .map((line, idx) =>
      idx !== 1
        ? line
            .split('|')
            .slice(1, -1)
            .map(
              (item) =>
                ({
                  content: [
                    {
                      type: 'text',
                      content: item.trim(),
                    },
                  ],
                  rowspan: 1,
                  colspan: 1,
                  type: idx === 0 ? 'header' : 'cell',
                }) as TableCell
            )
        : undefined
    )
    .filter((item) => item !== undefined) as TableCell[][]
  // console.log(result)
  return (isRef(result) ? result.value : result) as TableCell[][]
}

function useMarkdown() {
  const result = importFromMarkdown(mdsrc.value)
  const size = countSize(result)
  config.value.col = size.col
  config.value.row = size.row
  cells.value = fill(size.row, size.col, 'row')
  cells.value = cells.value.map((row, idx_row) => {
    row.map((cell, idx_col) => {
      cell.content = result[idx_row][idx_col].content
      cell.type = idx_row === 0 ? 'header' : 'cell'
      return cell
    })
    return row
  })
  console.log(cells.value, '114')
  config.value.open = false
}

console.log(cells.value)

function fill(row: number, col: number, header: 'row' | 'col' | 'default') {
  function isHeader(row: number, col: number, type: 'row' | 'col' | 'default') {
    if (type === 'default') return 'cell'
    if (type === 'row') return row === 0
    if (type === 'col') return col === 0
  }
  return new Array(row).fill(0).map((_, row) =>
    new Array(col).fill(0).map(
      (_, col) =>
        ({
          content: [],
          rowspan: 1,
          colspan: 1,
          type: isHeader(row, col, header),
        }) as TableCell
    )
  )
}

const size = ref(countSize(cells.value))

console.log(size.value)

const config = ref({
  open: cells.value.length === 0,
  row: 0,
  col: 0,
  type: 'default' as 'row' | 'col' | 'default',
})

if (size.value.col === 0 || size.value.row === 0) {
  config.value.open = true
}

function onChangedConfig() {
  cells.value = fill(size.value.row, size.value.col, config.value.type)
  config.value.open = false
}

watch(
  cells,
  () => {
    emits('update:modelValue', cells.value)
    size.value = countSize(cells.value)
    if (size.value.col === 0 || size.value.row === 0) {
      config.value.open = true
    }
  },
  {
    immediate: true,
    deep: true,
  }
)
</script>

<template>
  <div
    style="text-align: center; margin: 0px auto; padding-left: 2rem !important"
  >
    <ElDrawer v-model="config.open" direction="rtl" size="40%">
      <ElForm label-position="top">
        <ElFormItem label="行数">
          <ElInput v-model.number="size.row" :min="1" />
        </ElFormItem>
        <ElFormItem label="列数">
          <ElInput v-model.number="size.col" :min="1" />
        </ElFormItem>
        <ElButton
          text
          bg
          round
          type="primary"
          :icon="Check"
          @click="onChangedConfig"
          >确定</ElButton
        >
        <ElFormItem label="导入">
          <ElInput type="textarea" v-model="mdsrc" autosize />
          <ElButton
            text
            bg
            round
            class="full-width"
            type="primary"
            @click="useMarkdown"
            >导入</ElButton
          >
        </ElFormItem>
      </ElForm>
    </ElDrawer>
    <table
      v-if="!config.open"
      class="table-fixed caption-top border-collapse pl-4"
    >
      <tbody>
        <tr v-for="(item, row) in cells" :key="row">
          <td
            v-for="(cell, col) in item"
            :class="[
              'border',
              'border-slate-300',
              'px-6',
              'py-1',
              cell.type === 'header' ? 'border-header' : 'border-cell',
            ]"
            :key="col"
            :rowspan="cell.rowspan"
            :colspan="cell.colspan"
            style="text-align: center"
          >
            <PContent v-if="!editable" :content="cell.content" />
            <PTableCellEdit
              v-model="cell.content"
              v-model:colspan="cell.colspan"
              v-model:rowspan="cell.rowspan"
              v-model:type="cell.type"
              v-else
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.border-cell {
  border: 1px solid #d5d5d5 !important;
}

.border-header {
  background-color: #efefef !important;
  border: 1px solid #d5d5d5 !important;
  font-family: 'Ubuntu', 'Source Han Sans' !important;
}

.border {
  border-radius: 2px;
}

.full-width {
  width: 100%;
}

@media print {
  .border {
    border: 1px solid #000000 !important;
    background-color: #ffffff !important;
    font-family: 'Source Han Serif' !important;
    border-radius: 0%;
  }
}
</style>
