<script setup lang="ts">
/* global defineProps */
import { toRef } from 'vue'
import type { TableCell } from '@/../@types/content'
import PContent from './PContent.vue'

const props = defineProps<{
  content: TableCell[][]
}>()

const content = toRef(props, 'content')
</script>

<template>
  <div style="text-align: center; margin: 0px auto">
    <table class="table-fixed caption-top border-collapse">
      <tbody>
        <tr v-for="(item, row) in content" :key="row">
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
            <span v-if="cell.type === 'header'">
              <PContent :content="cell.content" class="border-header" />
            </span>
            <span v-else>
              <PContent :content="cell.content" class="border-cell" />
            </span>
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

@media print {
  .border {
    border: 1px solid #000000 !important;
    background-color: #ffffff !important;
    font-family: 'Source Han Serif' !important;
    border-radius: 0%;
  }
}
</style>
