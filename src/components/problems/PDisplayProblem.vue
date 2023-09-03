<script setup lang="ts">
/* global defineProps */
import type { AllProblem } from '@/../@types/problem'
import { toRefs, ref, unref } from 'vue'
import PProblem from './PProblem.vue'
import { ElResult, ElSkeleton, ElCard } from 'element-plus'
import { useRouter } from 'vue-router'
import { getProblem } from '@/api'

const router = useRouter()

const props = defineProps<{
  _id: string
  mode: 'display' | 'page'
  order: number
  paper?: boolean
  groupPreview: boolean
}>()

const { _id, mode, order, paper, groupPreview } = toRefs(props)

console.log(unref(_id), unref(groupPreview))

const problem = ref<AllProblem | null>(null)
const loaded = ref(false)
const error = ref(false)
const errText = ref('')
const statusCode = ref(200)
const d = ref({})

getProblem(_id.value)
  .then((response) => {
    loaded.value = true
    problem.value = response as AllProblem
  })
  .catch((err) => {
    console.log(err)
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
          :problem="(problem as AllProblem)"
          :mode="mode"
          :order="order"
          :level="0"
          :_id="_id"
          @dblclick="groupPreview ? router.push(`/problem/display/${_id}`) : undefined"
          :in-paper="paper"
          :group-preview="groupPreview"
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
