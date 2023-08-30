<script lang="ts" setup>
/* global defineProps */
import type { MaterialContent } from '@/../@types/content'
import PContent from './PContent.vue'
import { toRefs } from 'vue'

const props = defineProps<{
  material: MaterialContent['material']
}>()

const { material } = toRefs(props)
</script>

<template>
  <div class="all pl-8">
    <!-- eslint-disable-next-line no-irregular-whitespace -->
    <span class="order">材料{{ material.label }}</span>　
    <PContent class="material" :content="material.content" prompt />
    <p v-if="material.origin" class="author">——{{ material.origin }}</p>
  </div>
</template>

<style scoped>
.all {
  width: 100%;
}
.material {
  font-family: '方正楷体' !important;
}

.order {
  font-family: 'Source Han Sans SC';
}

.author {
  text-align: right;
  font-family: '方正仿宋';
}
</style>
