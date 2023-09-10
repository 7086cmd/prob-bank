<script setup lang="ts">
import { ElCard, ElDrawer } from 'element-plus';
import { toRefs, ref, watch } from 'vue';
import PProblem from '../problems/PProblem.vue';
import PCreateProblem from '../problems/PCreateProblem.vue';
import type { AllProblem } from '@/../@types/problem';

const props = defineProps<{
  modelValue: AllProblem
  level: 0 | 1 | 2
}>()

const emits = defineEmits([
  'update:modelValue',
])

const edit = ref(false)

const { modelValue, level } = toRefs(props)

const prob = ref(modelValue.value)

watch(
  () => prob.value,
  () => {
    emits('update:modelValue', prob.value)
  },
  {
    immediate: true,
    deep: true,
  }
)
</script>

<template>
  <ElCard>
    <PProblem v-if="edit" :problem="prob" mode="display" :order="1" :level="level" group-preview />
    <span v-else>编辑中</span>
  </ElCard>
  <ElDrawer v-model="edit" direction="rtl" size="80%" header="编辑题目">
    <PCreateProblem v-model="prob" mode="group" :level="0" />
  </ElDrawer>
</template>
