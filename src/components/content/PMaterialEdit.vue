<script setup lang="ts">
import type { Content } from '@/../@types/content'
import { ElCard, ElForm, ElFormItem, ElInput, ElSwitch } from 'element-plus'
import { reactive, ref, toRefs, watch } from 'vue'
import PContentEditor from './PContentEditor.vue'
import PMaterial from './PMaterial.vue'

const props = defineProps<{
  modelValue: Content[]
  label: string
  origin?: string
}>()

const emits = defineEmits([
  'update:modelValue',
  'update:label',
  'update:origin',
])

const { modelValue, label, origin } = toRefs(props)

const ctn = ref(modelValue.value)
const lab = ref(label?.value)
const orig = ref(origin?.value)
const mat = reactive({
  type: 'material',
  material: {
    label: lab.value,
    content: ctn.value as Content[],
    origin: orig.value,
  },
})

watch(
  () => ctn.value,
  () => {
    console.log('x')
    emits('update:modelValue', ctn)
    mat.material.content = ctn.value
  },
  {
    immediate: true,
    deep: true,
  }
)

watch(
  lab,
  () => {
    emits('update:label', lab.value)
    mat.material.label = lab.value
  },
  {
    immediate: true,
  }
)

watch(
  orig,
  () => {
    emits('update:origin', orig.value)
    mat.material.origin = orig.value
  },
  {
    immediate: true,
  }
)

const preview = ref(false)
</script>

<template>
  <ElCard shadow="hover">
    <ElForm>
      <ElFormItem label="预览">
        <ElSwitch v-model="preview" />
        <ElCard shadow="hover" v-if="preview" style="width: 100%">
          <PMaterial :material="mat.material" />
        </ElCard>
      </ElFormItem>
      <ElFormItem label="来源" v-if="!preview">
        <ElInput v-model="orig" />
      </ElFormItem>
      <ElFormItem label="序列" v-if="!preview">
        <ElInput v-model="lab">
          <template #prepend>
            <span>材料</span>
          </template>
        </ElInput>
      </ElFormItem>
      <ElFormItem label="内容" v-if="!preview">
        <PContentEditor v-model="ctn" :disables="['material', 'formula']" />
      </ElFormItem>
    </ElForm>
  </ElCard>
</template>
