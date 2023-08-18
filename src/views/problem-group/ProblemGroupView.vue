<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  ElInput,
  ElButton,
  ElDivider,
  ElRow,
  ElCol,
} from 'element-plus'
import { Right, Plus } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useStatusStore } from '@/stores/status'

const router = useRouter()
const status = useStatusStore()

const pId = ref('')
</script>

<template>
  <div>
    <transition
      enter-active-class="animate__animated animate__fadeInLeft"
      appear
    >
      <div>
        <span v-if="status.type === 'preview'" class="text-2xl">
          题组索引页
        </span>
        <ElDivider v-if="status.type === 'preview'" />
      </div>
    </transition>
    <transition
      enter-active-class="animate__animated animate__fadeInRight"
      appear
    >
      <div>
        <div v-if="status.type === 'preview'" style="text-align: right">
          <ElButton
            type="success"
            text
            bg
            circle
            :icon="Plus"
            @click="() => router.push('/problem-group/insert')"
          />
        </div>
        <ElDivider v-if="status.type === 'preview'" />
      </div>
    </transition>
    <transition enter-active-class="animate__animated animate__fadeInUp" appear>
      <ElRow v-if="status.type === 'preview'">
        <ElCol :span="23">
          <ElInput
            v-model="pId"
            placeholder="请输入题组 ID"
            @keyup.enter="() => router.push(`/problem-group/display/${pId}`)"
          />
        </ElCol>
        <ElCol :span="1">
          <div style="text-align: right">
            <ElButton
              type="primary"
              text
              bg
              circle
              :icon="Right"
              @click="() => router.push(`/problem-group/display/${pId}`)"
            />
          </div>
        </ElCol>
      </ElRow>
    </transition>
  </div>
</template>
