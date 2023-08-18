<script setup lang="ts">
/* global defineProps */
/**
 * 这里，主要是对于 LaTeX 显示于本项目中的“响应式”处理，主要是因为打印和显示等情况下字体不符合等原因所造成。
 */
import { useStatusStore } from '@/stores/status'
import { toRef, onMounted, ref } from 'vue'
import katex from 'katex'

const props = defineProps<{
  expression: string
}>()

const status = useStatusStore()
const renderString = ref('')

const expression = toRef(props, 'expression')

onMounted(() => {
  renderString.value = katex.renderToString(expression.value, {
    displayMode: false,
    throwOnError: false,
  })
})

const fontSize = toRef(status, 'fontSize')
</script>

<template>
  <span class="tex" v-html="renderString"></span>
</template>

<style>
.katex {
  font-size: v-bind((fontSize) + 'px') !important;
  color: #000000 !important;
  font-family: 'Latin Morden Math', 'Source Han Serif' !important;
  margin-bottom: 0 !important;
}

.mtight {
  font-size: v-bind((fontSize - 1) + 'px') !important;
  zoom: 96% !important;
}

table {
  font-size: v-bind((fontSize - 1) + 'px') !important;
}

table .mtight {
  font-size: v-bind((fontSize - 2) + 'px') !important;
  zoom: 84% !important;
}

@media print {
  .mtight {
    zoom: 92% !important;
  }
  .formula {
    color: #000000 !important;
  }
}

.frac-line {
  color: #000000 !important;
  /* display: none !important; */
  border: none !important;
  box-sizing: border-box !important;
  border-color: #000000 !important;
  max-height: 2px;
  /* border-bottom-width: 0.02em !important; */
}

.frac-line::before,
.frac-line::after {
  box-sizing: border-box !important;
  border-color: #000000 !important;
  /* border-bottom-width: 0.02em !important; */
}
</style>
