<script setup lang="ts">
// @ts-nocheck
import { ref } from 'vue'
import { usePaperStore } from '@/stores/paper'
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElRadioGroup,
  ElRadioButton,
  ElOption,
  ElSelect,
  ElButton,
} from 'element-plus'
import { sbjs, levs } from '@/utils/subject'
import { Check } from '@element-plus/icons-vue'
import { v4 } from 'uuid'
import { useRouter } from 'vue-router'

const paper = usePaperStore()
const router = useRouter()

const metadata = paper.useMetadata()

const name = ref(metadata.name)

const level_giant = ref(metadata.level[0])

const level_num = ref<number>(metadata.level[1])

const subject = ref(metadata.subject)

function confirmMetadata() {
  paper.setMetadata({
    name: name.value,
    level: [
      level_giant.value as 'P' | 'J' | 'S' | 'U' | 'V',
      level_num.value as number,
    ],
    subject: subject.value,
  })
  paper.setId(v4())
  router.push('/paper')
}
</script>

<template>
  <Transition enter-active-class="animate__animated animate__fadeInLeft" appear>
    <ElForm>
      <p class="py-4 text-2xl">填写试卷元数据</p>
      <ElFormItem label="标题">
        <ElInput v-model="name" />
      </ElFormItem>
      <ElFormItem label="科目">
        <ElRadioGroup v-model="subject">
          <ElRadioButton
            v-for="item in sbjs"
            :key="item.value"
            :label="item.value"
          >
            {{ item.label }}
          </ElRadioButton>
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem label="年级">
        <ElInput
          v-model.number="level_num"
          placeholder="在左侧选择类型，在此处输入年级数字，如“高一”即左侧选择“高中”，此处输入 1"
        >
          <template #prepend>
            <ElSelect width="8rem" v-model="level_giant" placeholder="请选择">
              <ElOption
                v-for="item in levs"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </template>
          <template #append>
            <span>年级</span>
          </template>
        </ElInput>
      </ElFormItem>
      <ElButton
        text
        bg
        type="primary"
        :icon="Check"
        class="full-width"
        @click="confirmMetadata"
        >确定</ElButton
      >
    </ElForm>
  </Transition>
</template>

<style scoped>
.full-width {
  width: 100%;
}
</style>
