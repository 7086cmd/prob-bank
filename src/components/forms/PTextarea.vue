<script setup lang="ts">
/* global defineProps, defineEmits */
import { ElCard, ElButton, ElInput, ElIcon } from 'element-plus'
import { QuestionFilled, Right } from '@element-plus/icons-vue'
import { md2c } from '@/utils/md2c'
import { c2md } from '@/utils/c2md'
import { ref, toRefs } from 'vue'
import type { Content } from '@/../@types/content'
import PContent from '../content/PContent.vue'

const emits = defineEmits(['update:modelValue'])
const props = defineProps<{
  modelValue: Content[]
  prompt?: boolean
}>()

const { prompt } = toRefs(props)

const content = ref(c2md(props.modelValue))
const arr = ref(props.modelValue)
const mode = ref('view')

function useEdit() {
  mode.value = 'edit'
  content.value = c2md(arr.value)
}

function useSave() {
  mode.value = 'view'
  arr.value = md2c(content.value)
  emits('update:modelValue', arr.value)
  content.value = ''
}
</script>

<template>
  <div>
    <ElCard v-if="mode === 'view'" shadow="never" @dblclick="useEdit">
      <span v-if="arr.length === 0" style="color: #a8abb2">双击以编辑</span>
      <PContent :content="arr" :prompt="prompt" />
    </ElCard>
    <ElCard v-else shadow="never" class="px-2">
      支持 Markdown 语法。请注意点击<ElIcon><Right /></ElIcon>按钮以保存内容。
      <ElButton
        type="info"
        size="small"
        text
        bg
        circle
        :icon="QuestionFilled"
        @click="$router.push('/help/markdown')"
      />
      <ElInput type="textarea" v-model="content" />
      <div style="text-align: right" class="py-2">
        <ElButton
          type="success"
          circle
          text
          bg
          @click="useSave"
          :icon="Right"
        />
      </div>
    </ElCard>
  </div>
</template>

<style>
.empasis {
  text-emphasis: dot;
  text-emphasis-position: under;
  font-style: normal;
}

.wave {
  text-decoration-style: wavy;
  text-decoration-line: underline;
}

.underline {
  text-decoration-line: underline;
}

.double-underline {
  text-decoration-line: underline;
  text-decoration-style: double;
}
</style>
