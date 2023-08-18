<script lang="ts" setup>
/* eslint-disable vue/valid-v-model */
import { ref } from 'vue'
import type { AllProblem } from '@/../@types/problem'
import { useRoute, useRouter } from 'vue-router'
import { ElResult, ElCard } from 'element-plus'
import PCreateProblem from '@/components/problems/PCreateProblem.vue'
import { useStatusStore } from '@/stores/status'
import { getProblem } from '@/api'

const route = useRoute()
const router = useRouter()
const status = useStatusStore()

const id = route.params.id as string

if (!id) {
  router.push('/problem/create')
}

const loaded = ref(false)

const error = ref(false)
const errText = ref('')
const errCode = ref(200)

const mode = ref('default')

const prob = ref<AllProblem>()

getProblem(id)
  .then((resp) => {
    prob.value = resp as AllProblem
    loaded.value = true
    if (prob.value?.inGroup) {
      mode.value = 'group'
    }
  })
  .catch((err) => {
    error.value = true
    errText.value = err.response.data.message
    errCode.value = err.response.data.code
  })
</script>

<template>
  <div>
    <transition leave-active-class="animate__animated animate__fadeOut">
      <div>
        <PCreateProblem
          v-if="loaded"
          v-model="(prob as AllProblem)"
          :level="0"
          :mode="(mode as 'default' | 'group')"
        />
        <div v-if="error" class="pt-2">
          <ElCard shadow="never">
            <ElResult
              icon="error"
              :title="`加载失败（${errCode}）`"
              :sub-title="errText"
            />
          </ElCard>
        </div>
      </div>
    </transition>
    <transition
      enter-active-class="animate__animated animate__fadeIn"
      appear
      leave-active-class="animate__animated animate__fadeOut"
    >
      <div class="text-2xl" v-if="status.type === 'print'">
        该页面不支持打印，请转到详情页面。
      </div>
    </transition>
  </div>
</template>

<style scoped>
.animate__fadeOut {
  position: absolute;
}
</style>
