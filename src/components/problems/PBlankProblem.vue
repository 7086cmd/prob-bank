<script lang="ts" setup>
/* global defineProps */
import type { Problem } from '@/../@types/problem'
import { toRefs } from 'vue'
import PContent from '../content/PContent.vue'
import { useStatusStore } from '@/stores/status'
import { getOrderText } from '@/utils/orderResult'

const status = useStatusStore()

const props = defineProps<{
  problem: Problem
  type: 'display' | 'edit' | 'page'
  order?: number
  level: 0 | 1 | 2 // 0 为“．”，总序号；1 为“（）”，小题；2 为圈（如“①”），“圈1”、“圈2”．
}>()

const { problem, type, order, level } = toRefs(props)
</script>

<template>
  <div :style="{ fontSize: `${status.fontSize}px` }">
    <div v-if="type === 'display'" :class="level === 0 ? [] : ['pl-4']">
      <span class="origin">{{
        getOrderText({
          level: level as 0 | 1 | 2,
          index: order as number,
          origin: problem.origin,
        })
      }}</span>
      <PContent :content="problem.content" />
    </div>
  </div>
</template>
