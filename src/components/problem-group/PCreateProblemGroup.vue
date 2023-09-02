<script setup lang="ts">
/* global defineProps, defineEmits */
import { ref, toRefs, watch } from 'vue'
import type { ProblemGroup } from '@/../@types/problem-group'
import PContentEditor from '../content/PContentEditor.vue'
import {
  ElButton,
  ElCard,
  ElCol,
  ElDivider,
  ElDrawer,
  ElForm,
  ElFormItem,
  ElInput,
  ElNotification,
  ElOption,
  ElRow,
  ElSelect,
} from 'element-plus'
import { Delete, Plus, Upload } from '@element-plus/icons-vue'
import type { AllProblem } from '@/../@types/problem'
import dayjs from 'dayjs'
import PDisplayProblem from '@/components/problems/PDisplayProblem.vue'
import PCreateProblem from '@/components/problems/PCreateProblem.vue'
import { Save } from '@icon-park/vue-next'
import { postProblemGroup, putProblemGroup } from '@/api'

const props = defineProps<{
  modelValue: ProblemGroup
  mode: 'modify' | 'insert'
  // There is no "level" in Problem Group
}>()
const emits = defineEmits(['update:modelValue'])

const { modelValue, mode } = toRefs(props)
const step = ref(1)

watch(modelValue.value, () => {
  emits('update:modelValue', modelValue.value)
})

const types = [
  {
    label: '可分型题组',
    value: 'removable',
    description:
      '类似于“根据 XX，回答 X-Y 题，每道题相对而言可以依据材料单独成题”',
  },
  {
    label: '不可分型题组',
    value: 'unremovable',
    description:
      '类似于阅读理解、完形填空等，序号按照整张试卷来，但是每道题一般不单独分割',
  },
]

const problemsOfRemovable = ref<
  {
    problem: AllProblem
    open: boolean
  }[]
>([])

async function createmodelValueUploader() {
  step.value += 1
  let method = 'put'
  if (modelValue.value._id === '') {
    method = 'post'
  }

  if (modelValue.value.type === 'removable') {
    modelValue.value.problems = problemsOfRemovable.value.map(
      (x) => x.problem._id
    )
  }

  const result = await (method === 'post' ? postProblemGroup : putProblemGroup)(modelValue.value)

  if (result) {
    modelValue.value._id = result as string
  }

  ElNotification({
    title: '操作成功',
    message: method === 'post' ? '题组创建成功' : '题组更新成功',
  })
}

function createRemovableProblem() {
  problemsOfRemovable.value.push({
    problem: {
      _id: '',
      type: '',
      content: [],
      image: undefined,
      details: {
        analytical: '',
        procedure: [],
        comment: '',
        tags: [],
      },
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      data: {
        subject: modelValue.value.data.subject,
        origin: modelValue.value.data.origin,
        level: modelValue.value.data.level,
        difficulty: 0,
        referred: 0,
      },
      subProblems: [],
      inGroup: modelValue.value._id,
    },
    open: true,
    answer: '',
  } as unknown as {
    problem: AllProblem
    open: boolean
  })
}

function deleteRemovableProblemPop() {
  problemsOfRemovable.value.pop()
}

const subjects = [
  { label: '语文', value: 'Chinese' },
  { label: '数学', value: 'Math' },
  { label: '英语', value: 'English' },
  { label: '物理', value: 'Physics' },
  { label: '化学', value: 'Chemistry' },
  { label: '生物', value: 'Biology' },
  { label: '政治', value: 'Politics' },
  { label: '历史', value: 'History' },
  { label: '地理', value: 'Geography' },
  { label: '信息技术', value: 'IT' },
  { label: '通用技术', value: 'General Technology' },
  { label: '其他', value: 'Other' },
]

const gardes = [
  { label: '小学', value: 'P', disabled: true },
  { label: '初中', value: 'J', disabled: true },
  { label: '高中', value: 'S' },
  { label: '大学', value: 'U', disabled: true },
  { label: '中职', value: 'V', disabled: true },
]
</script>

<template>
  <div>
    <Transition
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
      appear
    >
      <ElForm>
        <p class="text-2xl pt-4">
          {{ mode === 'insert' ? '创建题组' : '编辑题组' }} (Step {{ step }})
        </p>
        <br />
        <ElFormItem label="题组编码">
          <ElInput
            readonly
            v-model="modelValue._id"
            placeholder="由系统在录入时自动创建 Object ID"
          />
        </ElFormItem>
        <ElFormItem label="题组类型">
          <ElSelect
            v-model="modelValue.type"
            placeholder="请选择"
            class="full-width"
            v-if="modelValue._id == ''"
          >
            <ElOption
              v-for="item in types"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
          <ElInput
            v-model="types.filter((x) => x.value === modelValue.type)[0].label"
            readonly
            v-else
          />
          <br />
          <p class="pl-6" v-if="modelValue.type && step === 1">
            {{
              types.filter((x) => x.value === modelValue.type)[0].description
            }}
          </p>
        </ElFormItem>
        <ElFormItem label="题组来源">
          <ElInput
            v-model="modelValue.data.origin"
            placeholder="请输入题组来源"
          ></ElInput>
        </ElFormItem>
        <ElFormItem label="所属科目">
          <ElRadioGroup v-model="modelValue.data.subject">
            <ElRadioButton
              v-for="item in subjects"
              :key="item.value"
              :label="item.value"
            >
              {{ item.label }}
            </ElRadioButton>
          </ElRadioGroup>
        </ElFormItem>
        <ElFormItem label="所属年级">
          <ElInput
            v-model.number="modelValue.data.level[1]"
            placeholder="在左侧选择类型，在此处输入年级数字，如“高一”即左侧选择“高中”，此处输入 1"
          >
            <template #prepend>
              <ElSelect
                width="8rem"
                v-model="modelValue.data.level[0]"
                placeholder="请选择"
              >
                <ElOption
                  v-for="item in gardes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                />
              </ElSelect>
            </template>
            <template #append>
              <span>年级</span>
            </template>
          </ElInput>
        </ElFormItem>
        <ElFormItem label="信息描述">
          <PContentEditor v-model="modelValue.prompts" class="full-width" prompt />
        </ElFormItem>
        <Transition
          enter-active-class="animate__animated animate__fadeIn"
          leave-active-class="animate__animated animate__fadeOut"
        >
          <ElButton
            v-if="step === 1"
            class="full-width"
            text
            bg
            @click="createmodelValueUploader"
            type="success"
            :icon="Upload"
          >
            上传题组信息，并且开始添加题目
          </ElButton>
        </Transition>
        <ElFormItem
          label="添加题目"
          v-if="modelValue.type === 'removable' && step === 2"
        >
          <ElCard shadow="never" class="full-width">
            <ElRow>
              <ElCol
                :span="problemsOfRemovable.length === 0 ? 23 : 22"
                style="color: #909399"
              >
                Removable
                类型的题组要求每道题目都已经存储在数据库中，在下载时不会下载原题，但是每道题目若单独成题时，会显示题组中的信息。
                <br />
                因此，如果需要修改题组中题目的题干，只需要在题干中编辑即可，不但可以效力于题目本身，题组中也可相应的完成修改。
              </ElCol>
              <ElCol
                :span="problemsOfRemovable.length === 0 ? 1 : 2"
                style="text-align: center"
              >
                <ElButton
                  type="danger"
                  v-if="problemsOfRemovable.length >= 1"
                  text
                  bg
                  circle
                  :icon="Delete"
                  @click="deleteRemovableProblemPop"
                />
                <ElButton
                  type="success"
                  text
                  bg
                  circle
                  :icon="Plus"
                  @click="createRemovableProblem"
                />
              </ElCol>
            </ElRow>
            <ElDivider />
            <div
              v-for="(problem, idx) in problemsOfRemovable"
              :key="problem.problem._id"
            >
              <PDisplayProblem
                v-if="problem.problem._id !== '' && !problem.open"
                :_id="problem.problem._id"
                :order="idx + 1"
                mode="display"
                group-preview
                @dblclick="problem.open = true"
              />
              <ElDrawer
                v-else
                v-model="problem.open"
                title="编辑题目"
                size="80%"
                direction="rtl"
              >
                <template #default>
                  <PCreateProblem
                    v-model="problemsOfRemovable[idx].problem"
                    :level="0"
                    mode="group"
                  />
                </template>
              </ElDrawer>
            </div>
          </ElCard>
        </ElFormItem>
        <ElButton
          v-if="step === 2"
          class="full-width"
          text
          bg
          type="warning"
          :icon="Save"
          @click="createmodelValueUploader"
        >
          保存修改结果
        </ElButton>
      </ElForm>
    </Transition>
  </div>
</template>

<style scoped>
.full-width {
  width: 100%;
}
</style>
