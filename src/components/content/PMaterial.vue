<script lang="ts" setup>
/* global defineProps */
import type { MaterialContent } from '@/../@types/content'
import { ElRow, ElCol } from 'element-plus'
import PContent from './PContent.vue'
import { toRefs } from 'vue'

const props = defineProps<{
  materials: MaterialContent['materials']
}>()

const { materials } = toRefs(props)

const ordlist = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'] // Only support 10 MAX
</script>

<template>
  <ElRow v-for="(material, idx) in materials" :key="idx">
    <ElCol :span="3" class="order"
      >材料{{ materials.length === 1 ? '' : ordlist[idx + 1] }}</ElCol
    >
    <ElCol :span="21">
      <PContent class="material" :content="material.content" />
      <p v-if="material.origin" class="author">{{ material.origin }}</p>
    </ElCol>
  </ElRow>
</template>

<style scoped>
.material {
  font-family: '方正楷体';
}

.order {
  font-family: 'Source Han Sans SC';
}

.author {
  text-align: right;
  font-family: '方正仿宋';
}
</style>
