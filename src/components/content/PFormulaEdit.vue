<script setup lang="ts">
/* global defineProps, defineEmits */
import { ref, watch, toRefs, onMounted } from 'vue'
import { useStatusStore } from '@/stores/status'
import { ElPopover, ElInput } from 'element-plus'
import { useSettingsStore } from '@/stores/settings'

const settings = useSettingsStore()

const props = defineProps<{
  modelValue: string
  editable: boolean
  display?: number
}>()
const emits = defineEmits(['update:modelValue'])

const { modelValue, editable, display } = toRefs(props)

const renderedString = ref('')
const status = useStatusStore()
const { fontSize } = toRefs(status)
const inputedString = ref(modelValue.value)
const hover = ref(false)
const formulaIt = ref<InstanceType<typeof HTMLSpanElement>>()
const handler = (str: string) => {
  let result = str
  if (display?.value !== 1)
    if (settings.math.collection.collectionOfNumbersDisplayMode === 'bold') {
      result = result.replaceAll('\\mathbb', '\\bold')
    } else {
      result = result.replaceAll('\\bold', '\\mathbb')
    }
  if (display?.value !== 2)
    if (settings.math.collection.irrationalNumbers === '\\mathbb{Q}^c') {
      result = result.replaceAll(
        '\\complement_{\\mathbb{Q}}\\mathbb{R}',
        '\\mathbb{Q}^c'
      )
    } else {
      result = result.replaceAll(
        '\\mathbb{Q}^c',
        '\\complement_{\\mathbb{Q}}\\mathbb{R}'
      )
    }
  return result
}

settings.$subscribe(() => {
  renderedString.value = window.probbank.renderKatex(
    handler(inputedString.value)
  )
})

onMounted(() => {
  renderedString.value = window.probbank.renderKatex(
    handler(inputedString.value)
  )
})

watch(inputedString, () => {
  emits('update:modelValue', inputedString.value)
  renderedString.value = window.probbank.renderKatex(
    handler(inputedString.value)
  )
  // formulaIt.value!.innerHTML = renderedString.value
})
</script>

<template>
  <ElPopover trigger="click" v-if="editable">
    <template #reference>
      <span
        ref="formulaIt"
        class="formula"
        :style="`background-color: ${
          hover ? '#e6f7ff' : '#ffffff'
        }; font-size: ${fontSize}px !important`"
        v-if="renderedString !== ''"
        @mouseover="hover = true"
        @mouseleave="hover = false"
        ><span v-html="renderedString"
      /></span>
      <span v-else @mouseover="hover = true" @mouseleave="hover = false">
        点我编辑内容
      </span>
    </template>
    <ElInput v-model="inputedString" />
  </ElPopover>
  <span v-else class="formula"><span v-html="renderedString" /></span>
</template>

<style>
.formula {
  word-break: break-all;
}

.katex {
  font-size: v-bind((fontSize) + 'px') !important;
  color: #000000 !important;
  /* font-family: 'Latin Morden Math', 'Source Han Serif' !important; */
  margin-bottom: 0 !important;
  word-break: break-all;
}

.mtight {
  font-size: v-bind((fontSize - 1) + 'px') !important;
  zoom: 92% !important;
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
  border-bottom-width: 0.02em !important;
}

.frac-line::before,
.frac-line::after {
  box-sizing: border-box !important;
  border-color: #000000 !important;
  border-bottom-width: 0.02em !important;
}
</style>
