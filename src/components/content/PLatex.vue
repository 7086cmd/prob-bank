<script setup lang="ts">
/* global defineProps */
/**
 * 这里，主要是对于 LaTeX 显示于本项目中的“响应式”处理，主要是因为打印和显示等情况下字体不符合等原因所造成。
 */
import { useStatusStore } from '@/stores/status'
import { toRef } from 'vue'
import { VueLatex } from 'vatex';

const props = defineProps<{
  expression: string
}>()

const status = useStatusStore()

const expression = toRef(props, 'expression')
</script>

<template>
  <span>&nbsp;<VueLatex :expression="expression" :fontsize="status.fontSize" />&nbsp;</span>
</template>
