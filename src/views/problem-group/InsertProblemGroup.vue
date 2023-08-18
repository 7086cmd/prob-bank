<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import PCreateProblemGroup from '@/components/problem-group/PCreateProblemGroup.vue'
import type { ProblemGroup } from '@/../@types/problem-group'
import dayjs from 'dayjs'

const route = useRoute()

const problemGroup = ref<ProblemGroup>({
  _id: route.params.id ? route.params.id as string : '',
  // @ts-ignore
  type: '',
  prompts: [],
  problems: [],
  data: {
    subject: '',
    origin: '',
    level: [undefined, undefined],
    difficulty: 0,
    referred: 0,
  },
  createAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  updateAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
} as unknown as ProblemGroup)
</script>

<template>
  <div>
    <PCreateProblemGroup v-model="problemGroup" mode="insert" />
  </div>
</template>
