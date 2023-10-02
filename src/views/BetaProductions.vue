<script setup lang="ts">
import PTableCellEdit from '@/components/content/PTableCellEdit.vue'
import PTableEdit from '@/components/content/PTableEdit.vue'
import type { TableCell } from '@types/content';
import { ref } from 'vue'

const opts = ref([])
const opts2 = ref([])
const answer = ref(0)
const answer2 = ref(0)
const judge = ref(false)

const tab = ref([
  [
    {
      content: [{ type: 'text', text: '选项' }],
      rowspan: 1,
      colspan: 1,
      type: 'header',
    },
    {
      content: [{ type: 'text', text: '物品' }],
      rowspan: 1,
      colspan: 1,
      type: 'header',
    },
    {
      content: [{ type: 'text', text: '主题' }],
      rowspan: 1,
      colspan: 1,
      type: 'header',
    },
    {
      content: [{ type: 'text', text: '地点' }],
      rowspan: 1,
      colspan: 1,
      type: 'header',
    },
  ],
  [
    {
      content: [{ type: 'text', text: 'A' }],
      rowspan: 1,
      colspan: 1,
      type: 'cell',
    },
    {
      content: [{ type: 'text', text: '瓷器' }],
      rowspan: 1,
      colspan: 1,
      type: 'cell',
    },
    {
      content: [{ type: 'text', text: '清淡含蓄' }],
      rowspan: 1,
      colspan: 1,
      type: 'cell',
    },
    {
      content: [{ type: 'text', text: '故宫博物馆汝窑瓷器展' }],
      rowspan: 1,
      colspan: 1,
      type: 'cell',
    },
  ],
  [
    {
      content: [{ type: 'text', text: 'B' }],
      rowspan: 1,
      colspan: 1,
      type: 'cell',
    },
    {
      content: [{ type: 'text', text: '壁画' }],
      rowspan: 1,
      colspan: 1,
      type: 'cell',
    },
    {
      content: [{ type: 'text', text: '交流互鉴' }],
      rowspan: 1,
      colspan: 1,
      type: 'cell',
    },
    {
      content: [{ type: 'text', text: '敦煌石窟与河西走廊丝路艺术展' }],
      rowspan: 1,
      colspan: 1,
      type: 'cell',
    },
  ],
  [
    {
      content: [{ type: 'text', text: 'C' }],
      rowspan: 1,
      colspan: 1,
      type: 'cell',
    },
    {
      content: [{ type: 'text', text: '鼎' }],
      rowspan: 1,
      colspan: 1,
      type: 'cell',
    },
    {
      content: [{ type: 'text', text: '鼎盛千秋' }],
      rowspan: 1,
      colspan: 1,
      type: 'cell',
    },
    {
      content: [{ type: 'text', text: '上海博物馆铜器特展' }],
      rowspan: 1,
      colspan: 1,
      type: 'cell',
    },
  ],
  [
    {
      content: [{ type: 'text', text: 'D' }],
      rowspan: 1,
      colspan: 1,
      type: 'cell',
    },
    {
      content: [{ type: 'text', text: '陶' }],
      rowspan: 1,
      colspan: 1,
      type: 'cell',
    },
    {
      content: [{ type: 'text', text: '远古回声' }],
      rowspan: 1,
      colspan: 1,
      type: 'cell',
    },
    {
      content: [{ type: 'text', text: '半坡遗址与半坡文化展' }],
      rowspan: 1,
      colspan: 1,
      type: 'cell',
    },
  ],
] as TableCell[][])
</script>

<template>
  <PTableCellEdit
    v-model="opts"
    v-model:rowspan="answer"
    v-model:colspan="answer2"
    v-model:header="judge"
  />
  i
  <PTableEdit v-model="tab" :editable="true" />
</template>
