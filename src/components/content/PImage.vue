<script setup lang="ts">
/* global defineProps */
import { ref, toRefs } from 'vue'
import { ElImage, ElIcon, ElText } from 'element-plus'
import { Picture } from '@element-plus/icons-vue'

const props = defineProps<{
  src: string
  alt?: string
}>()

const { src, alt } = toRefs(props)

const loading = ref(true)
</script>

<template>
  <ElImage v-loading="loading" :src="src" :alt="alt" @load="loading = false">
    <template #error>
      <div style="text-align: center">
        <ElIcon><Picture /></ElIcon>
        <ElText style="color: C0C4CC; font-size: 6px; text-align: center">
          加载失败
        </ElText>
      </div>
    </template>
    <template #viewer>
      <div v-if="alt">
        <ElText style="color: C0C4CC; font-size: 6px; text-align: center">
          {{ alt }}
        </ElText>
      </div>
    </template>
  </ElImage>
</template>
