<script setup lang="ts">
/* global defineProps */
import type { AllProblem } from '@/../@types/problem'
import { toRefs, ref, watch } from 'vue'
import PProblem from './PProblem.vue'
import { ElResult, ElSkeleton, ElCard } from 'element-plus'
import { useRouter } from 'vue-router'
import { getProblem } from '@/api'
import { getAnswerById } from './answer'
import type { Content } from '@/../@types/content'

const router = useRouter()

const props = defineProps<{
  _id: string
  mode: 'display' | 'page'
  order: number
  paper?: boolean
  groupPreview?: boolean
  filter?: string
}>()

const { _id, mode, order, paper, groupPreview, filter } = toRefs(props)

const problem = ref<AllProblem | null>(null)
const loaded = ref(false)
const error = ref(false)
const errText = ref('')
const statusCode = ref(200)
const d = ref({})
const answer = ref<Content[]>([])
const filtered = ref(false)

watch(
  () => filter?.value,
  () => {
    console.log('filter value changed')
    filtered.value = problem.value?.content
      .filter((x) => x.type === 'text')
      .map((x) => (x.type === 'text' ? x.content : ''))
      .join('')
      .includes(filter?.value as string) as boolean
    problem.value?.content.map((x) => {
      if (x.type === 'text' && filter?.value)
        x.content = x.content.replaceAll(
          filter?.value as string,
          `==${filter?.value}==`
        )
      return x
    })
  }
)

getProblem(_id.value)
  .then((response) => {
    problem.value = response as AllProblem
    filtered.value = problem.value.content
      .filter((x) => x.type === 'text')
      .map((x) => (x.type === 'text' ? x.content : ''))
      .join('')
      .includes(filter?.value as string)
    problem.value?.content.map((x) => {
      if (x.type === 'text' && filter?.value)
        x.content = x.content.replaceAll(
          filter?.value as string,
          `==${filter?.value}==`
        )
      return x
    })
    return getAnswerById(_id.value)
  })
  .then((response) => {
    answer.value = response
    loaded.value = true
  })
  .catch((err) => {
    error.value = true
    loaded.value = true
    d.value = err
    errText.value = err.response.data.message
    statusCode.value = err.response.data.code
  })
</script>

<template>
  <div>
    <transition
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
      appear
    >
      <div v-if="!loaded">
        <ElCard shadow="never" class="pt-2">
          <ElSkeleton :rows="5" animated />
        </ElCard>
      </div>
    </transition>
    <transition enter-active-class="animate__animated animate__fadeIn">
      <div v-if="loaded && !error">
        <PProblem
          :problem="problem as AllProblem"
          v-if="filtered || !filter"
          :mode="mode"
          :order="order"
          :level="0"
          :_id="_id"
          @dblclick="
            groupPreview ? router.push(`/problem/display/${_id}`) : undefined
          "
          :in-paper="paper"
          :group-preview="groupPreview"
          :answer="answer as Content[]"
        />
      </div>
    </transition>
    <transition enter-active-class="animate__animated animate__fadeIn">
      <div v-if="loaded && error" class="pt-2">
        <ElCard shadow="never">
          <ElResult
            icon="error"
            :title="`加载失败（${statusCode}）`"
            :sub-title="errText"
          />
        </ElCard>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.animate__fadeOut {
  position: absolute;
}
</style>
