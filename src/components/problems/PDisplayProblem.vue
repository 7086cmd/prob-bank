<script setup lang="ts">
/* global defineProps */
import type { Problem } from '@/../@types/problem'
import axios from '@/plugins/axios'
import { toRefs, ref } from 'vue'
import PProblem from './PProblem.vue'
import { ElResult, ElSkeleton, ElCard } from 'element-plus'

const props = defineProps<{
  _id: string
  mode: 'display' | 'edit' | 'page'
  order: number
}>()

const { _id, mode, order } = toRefs(props)

const problem = ref<Problem | null>(null)
const loaded = ref(false)
const error = ref(false)
const errText = ref('')

axios('/problem', {
  method: 'get',
  params: {
    _id: _id.value,
  },
})
  .then((response) => {
    loaded.value = true
    problem.value = response.data.data as Problem
  })
  .catch((err) => {
    error.value = true
    errText.value = err.response.data.message
  })
</script>

<template>
  <div>
    <div v-if="!loaded">
      <ElCard shadow="never" class="pt-2">
        <ElSkeleton :rows="5" animated />
      </ElCard>
    </div>
    <div v-else-if="loaded && !error">
      <PProblem
        :problem="(problem as Problem)"
        :mode="mode"
        :order="order"
        :level="0"
      />
    </div>
    <div v-else-if="loaded && error" class="pt-2">
      <ElCard shadow="never">
        <ElResult status="error" title="加载失败" :subtitle="errText" />
      </ElCard>
    </div>
  </div>
</template>
