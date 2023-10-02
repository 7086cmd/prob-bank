<script setup lang="ts">
import { toRefs, ref, watch } from 'vue'
import type { Content } from '@/../@types/content'
import PContent from './PContent.vue'
import {
  ElDrawer,
  ElForm,
  ElFormItem,
  ElInput,
  ElSwitch,
  ElButton,
  ElButtonGroup,
} from 'element-plus'
import PContentEditor from './PContentEditor.vue'
import { Check, Delete } from '@element-plus/icons-vue'

const props = defineProps<{
  modelValue: Content[]
  colspan?: number
  rowspan?: number
  type: 'header' | 'cell'
  maxColspan?: number
  maxRowspan?: number
}>()

const emits = defineEmits([
  'update:modelValue',
  'update:colspan',
  'update:rowspan',
  'update:header',
  'delete',
])

const edit = ref(false)
let { modelValue, colspan, rowspan, type, maxColspan, maxRowspan } =
  toRefs(props)

if (!colspan?.value) {
  colspan = ref(1)
}

if (!rowspan?.value) {
  rowspan = ref(1)
}

const contents = ref<Content[]>(modelValue.value)
const spans = ref({
  colspan: colspan.value ?? 1,
  rowspan: rowspan.value ?? 1,
})
const header = ref(type.value === 'header')

watch(
  () => contents.value,
  () => {
    emits('update:modelValue', contents.value)
  },
  {
    immediate: true,
    deep: true,
  }
)

watch(
  () => spans.value,
  () => {
    emits('update:colspan', spans.value.colspan)
    emits('update:rowspan', spans.value.rowspan)
  },
  {
    immediate: true,
    deep: true,
  }
)

watch(
  () => header.value,
  () => {
    emits('update:header', header.value)
  },
  {
    immediate: true,
    deep: true,
  }
)
</script>

<template>
  <div v-if="!edit" @click="edit = true">
    <span v-if="contents.length === 0" @click="edit = true">请点击以编辑</span>
    <PContent v-else :content="contents" />
  </div>
  <span v-else>编辑中……</span>
  <Teleport to="body">
    <ElDrawer v-model="edit" direction="rtl" size="40%">
      <ElForm label-position="top">
        <ElFormItem label="内容">
          <PContentEditor
            class="full-width"
            v-model="contents"
            :disables="['table', 'material', 'article', 'code', 'article']"
          />
        </ElFormItem>
        <ElFormItem label="跨列">
          <ElInput
            :disabled="rowspan === 1"
            v-model.number="colspan"
            :min="1"
            :max="maxColspan"
          />
        </ElFormItem>
        <ElFormItem label="跨行">
          <ElInput
            :disabled="colspan === 1"
            v-model.number="rowspan"
            :min="1"
            :max="maxRowspan"
          />
        </ElFormItem>
        <ElFormItem label="类型">
          <ElSwitch v-model="header" inactive-text="表格" active-text="表头" />
        </ElFormItem>
        <ElFormItem label="操作">
          <ElButtonGroup class="full-width">
            <ElButton
              style="width: 50%"
              type="danger"
              :icon="Delete"
              text
              bg
              @click="emits('delete')"
              round
              >删除</ElButton
            >
            <ElButton
              style="width: 50%"
              type="primary"
              :icon="Check"
              text
              bg
              @click="edit = false"
              round
              >确定</ElButton
            >
          </ElButtonGroup>
        </ElFormItem>
      </ElForm>
    </ElDrawer>
  </Teleport>
</template>

<style scoped>
.full-width {
  width: 100%;
}
</style>
