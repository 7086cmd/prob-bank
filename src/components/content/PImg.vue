<script setup lang="ts">
import { toRefs, ref, watch } from 'vue'
import {
  ElCard,
  ElButton,
  type UploadUserFile,
  ElUpload,
  ElCol,
  ElRow,
} from 'element-plus'
import { Delete, Upload } from '@element-plus/icons-vue'
import PImage from './PImage.vue';

const props = defineProps<{
  modelValue: string
  alt?: string
}>()

const emits = defineEmits(['update:modelValue', 'update:alt'])

const { modelValue, alt } = toRefs(props)

const src = ref(modelValue.value)
const inputedAlt = ref(alt?.value)

function handleDelete() {
  src.value = ''
  inputedAlt.value = ''
  fileList.value = []
  emits('update:modelValue', '')
  emits('update:alt', '')
}

const handling = ref(false)

const fileList = ref<UploadUserFile[]>([])

watch(
  () => fileList.value,
  () => {
    if (fileList.value.length === 0) {
      fileList.value = []
      return
    }

    handling.value = true

    if (fileList.value.length > 1) {
      fileList.value = fileList.value.slice(0, 1)
    }

    const file = fileList.value[0].raw as File

    const reader = new FileReader()

    reader.readAsDataURL(file)

    reader.onload = () => {
      const base64 = reader.result as string
      src.value = base64
      console.log(base64)
      handling.value = false
      emits('update:modelValue', base64)
    }
  }
)
</script>

<template>
  <ElCard shadow="hover">
    <ElRow>
      <ElCol :span="4">
        <ElUpload
          class="full-width"
          v-if="!src"
          ref="uploadRef"
          :auto-upload="false"
          :limit="1"
          action="#"
          v-model:file-list="fileList"
          :disabled="fileList.length > 1"
          accept="image/*"
          :show-file-list="false"
        >
          <template #trigger>
            <ElButton
              circle
              text
              bg
              size="large"
              type="primary"
              :icon="Upload"
            />
          </template>
        </ElUpload>
        <ElButton
          v-else
          circle
          text
          bg
          size="large"
          type="warning"
          :icon="Delete"
          @click="handleDelete"
        />
      </ElCol>
      <ElCol>
        <PImage :src="src" :alt="inputedAlt" />
      </ElCol>
    </ElRow>
  </ElCard>
</template>
