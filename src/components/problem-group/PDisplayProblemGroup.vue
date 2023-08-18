<script setup lang="ts">
/* global defineProps */
// @ts-nocheck
import { toRefs, ref } from 'vue'
import PProblemGroup from './PProblemGroup.vue'
import { ElResult, ElSkeleton, ElCard } from 'element-plus'
import { useRouter } from 'vue-router'
import type { ProblemGroup } from '@/../@types/problem-group'
import { getProblemGroup } from '@/api'

const router = useRouter()

const props = defineProps<{
  _id: string
  mode: 'display' | 'page'
  order: number
}>()

const { _id, mode, order } = toRefs(props)

const problem = ref<ProblemGroup>()
const loaded = ref(false)
const error = ref(false)
const errText = ref('')
const statusCode = ref(200)

getProblemGroup(_id.value).then((resp) => {
  console.log(resp, 'resp')
  if (resp) {
    problem.value = resp as ProblemGroup
  } else {
    error.value = true
    errText.value = '题组不存在'
    statusCode.value = 404
  }
  loaded.value = true
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
        <PProblemGroup
          :group="problem"
          :mode="mode"
          :order="order"
          @dblclick="router.push(`/problem-group/display/${_id}`)"
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
