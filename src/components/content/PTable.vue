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
        <tr v-for="item in content" :key="item.toString()">
          <td
            v-for="cell in item"
            class="border border-slate-300 px-6 py-1"
            :key="cell.toString()"
            :rowspan="cell.rowspan"
            :colspan="cell.colspan"
            style="text-align: center"
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
  </div>
</template>
