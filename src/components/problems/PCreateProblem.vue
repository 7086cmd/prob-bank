<script lang="ts" setup>
/* eslint-disable vue/valid-v-model */
/* global defineProps defineEmits */
// @ts-nocheck
import {
  ElForm,
  ElFormItem,
  ElSelect,
  ElOption,
  ElRadioButton,
  ElRadioGroup,
  ElInput,
  ElSteps,
  ElStep,
  ElButton,
  ElRow,
  ElCol,
  ElCard,
  ElDivider,
  ElNotification,
  ElDrawer,
} from 'element-plus'
import { useStatusStore } from '@/stores/status'
import { ref, watch, toRefs } from 'vue'
import type { Content } from '@/../@types/content'
import { useRouter } from 'vue-router'
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Delete,
  Upload,
} from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { Notes, WritingFluently, Save } from '@icon-park/vue-next'
import PProblem from '@/components/problems/PProblem.vue'
import type {
  AllProblem,
  Problem,
} from '@/../@types/problem'
import { postProblem, putProblem } from '@/api'
import PContentEditor from '../content/PContentEditor.vue'
import { wrongTypes } from './wrong'
import POptionEdit from './POptionEdit.vue'

const status = useStatusStore()
const router = useRouter()

const emits = defineEmits(['update: modelValue', 'insert'])
const props = defineProps<{
  modelValue: AllProblem
  level: 0 | 1 | 2
  mode: 'group' | 'default'
}>()

const { modelValue, level, mode } = toRefs(props)

console.log(modelValue.value)

if (mode?.value) mode.value = 'default'

const options = ref<{ id: number; content: Content[] }[]>([])

watch(modelValue.value.subProblems, () => {
  emits('update: modelValue', modelValue.value)
})

const step = ref(0)

const modelValueTypeOptions = ref([
  {
    label: '判断题',
    value: 'judge',
  },
  {
    label: '单项选择题',
    value: 'single-choice',
  },
  {
    label: '不定项选择题',
    value: 'multiple-choice',
  },
  {
    label: '填空题',
    value: 'blank',
  },
  {
    label: '解答题',
    value: 'answer',
  },
])

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

const subProblems = ref<boolean[]>([])

const tags = ref<string[]>([])

function handlePostProblem() {
  modelValue.value.createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss')
  modelValue.value.updatedAt = dayjs().format('YYYY-MM-DD HH:mm:ss')
  const copy = Object.assign({}, modelValue.value) as unknown

  ;(copy as { _id?: string })['_id'] = undefined

  delete (copy as { _id?: string; updatedAt: string })._id

  postProblem(copy as AllProblem)
    .then((resp) => {
      modelValue.value._id = resp as string
      ElNotification({
        title: '成功',
        message: '题目已成功创建',
        type: 'success',
      })
    })
    .catch((err) => {
      ElNotification({
        title: '题目创建失败',
        message: err.message,
        type: 'error',
      })
    })
}

function updateProblem() {
  modelValue.value.updatedAt = dayjs().format('YYYY-MM-DD HH:mm:ss')
  putProblem(modelValue?.value)
    .then(() => {
      ElNotification({
        title: '成功',
        message: '题目已成功更新',
        type: 'success',
      })
    })
    .catch((err) => {
      ElNotification({
        title: '题目更新失败',
        message: err.message,
        type: 'error',
      })
    })
}

function handleSubmit() {
  // 如果 ObjectId 是合法的，那么就是用 PUT 方法更新，反之使用 POST 方法创建
  const valid = window.probbank.validObjectId(modelValue.value._id)
  if (valid) {
    updateProblem()
  } else {
    handlePostProblem()
  }
}

function createBlankProblem(
  key: number,
  type: AllProblem['type'] = 'single-choice'
) {
  let ansT: number | number[] | boolean | Content[] | undefined = 0
  switch (type) {
    case 'single-choice':
      ansT = 0
      break
    case 'judge':
      ansT = false
      break
    case 'blank':
      ansT = undefined
      break
    default:
      ansT = []
      break
  }
  const result = {
    _id: modelValue.value._id + '-' + key,
    type: modelValue.value.type,
    subProblems: [],
    content: [],
    answer: ansT,
    options: [],
    image: '',
    details: {
      analytical: '',
      procedure: [],
      comment: '',
      tags: modelValue.value.details.tags,
    },
    createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    data: {
      difficulty: modelValue.value.data.difficulty,
      referred: modelValue.value.data.referred,
      level: modelValue.value.data.level,
      subject: modelValue.value.data.subject,
      origin: modelValue.value.data.origin,
    },
    wrong: {
      type: '',
      reason: [],
      lesson: [],
    },
    inGroup: modelValue.value.inGroup,
  } as Problem
  return result
}

watch(
  () => modelValue.value.type,
  () => {
    switch (modelValue.value.type) {
      case 'single-choice': {
        modelValue.value.answer = 0
        break
      }
      case 'answer': {
        modelValue.value.answer = []
        break
      }
      case 'multiple-choice': {
        modelValue.value.answer = []
        break
      }
      case 'judge': {
        modelValue.value.answer = false
        break
      }
      default:
        break
    }
  }
)

watch(step, () => {
  if (step.value === 3) {
    if (level.value === 0) {
      handleSubmit()
      if (mode.value === 'default')
        router.push('/problem/display/' + modelValue.value._id.toString())
    } else {
      emits('insert')
    }
  }
})

function createSubProblem() {
  modelValue.value.subProblems.push({
    id: modelValue.value.subProblems.length + 1,
    problem: createBlankProblem(
      modelValue.value.subProblems.length + 1,
      modelValue.value.type
    ) as unknown as AllProblem,
  })
  subProblems.value.push(true)
}

function removeSubProblem() {
  modelValue.value.subProblems.pop()
  subProblems.value.pop()
}
</script>

<template>
  <div>
    <p class="text-2xl pt-3">编辑题目</p>
    <transition
      enter-active-class="animate__animated animate__fadeIn"
      appear
      mode="out-in"
    >
      <ElSteps :active="step" finish-status="success" class="pt-4" align-center>
        <ElStep title="题目分类" :icon="Notes" />
        <ElStep title="题干信息" :icon="WritingFluently" />
        <ElStep title="预览提交" :icon="Upload" />
      </ElSteps>
    </transition>
    <transition
      enter-active-class="animate__animated animate__fadeInRightBig"
      leave-active-class="animate__animated animate__fadeOutLeftBig"
      appear
      mode="out-in"
    >
      <ElForm
        class="pt-5"
        v-show="status.type === 'preview' && step === 0"
        :label-position="mode === 'default' ? 'right' : 'top'"
      >
        <ElFormItem label="编码">
          <ElInput
            readonly
            v-model="modelValue._id"
            placeholder="由系统在创建时自动生成唯一 ID"
          />
        </ElFormItem>
        <ElFormItem label="类型">
          <ElSelect
            class="full-width"
            v-model="modelValue.type"
            placeholder="请选择类型"
            :disabled="modelValue.createdAt !== modelValue.updatedAt"
          >
            <ElOption
              v-for="item in modelValueTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="来源">
          <ElInput
            v-model="modelValue.data.origin"
            :disabled="level !== 0 || modelValue.inGroup !== ''"
            placeholder="请输入题目来源"
          ></ElInput>
        </ElFormItem>
        <ElFormItem label="科目">
          <ElRadioGroup
            v-model="modelValue.data.subject"
            :disabled="level !== 0 || modelValue.inGroup !== ''"
          >
            <ElRadioButton
              v-for="item in subjects"
              :key="item.value"
              :label="item.value"
            >
              {{ item.label }}
            </ElRadioButton>
          </ElRadioGroup>
        </ElFormItem>
        <ElFormItem label="年级">
          <ElInput
            :disabled="level !== 0 || modelValue.inGroup !== ''"
            v-model.number="modelValue.data.level[1]"
            placeholder="在左侧选择类型，在此处输入年级数字，如“高一”即左侧选择“高中”，此处输入 1"
          >
            <template #prepend>
              <ElSelect
                width="8rem"
                v-model="modelValue.data.level[0]"
                placeholder="请选择"
                :disabled="level !== 0"
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
      </ElForm>
    </transition>
    <transition
      enter-active-class="animate__animated animate__fadeInRightBig"
      leave-active-class="animate__animated animate__fadeOutLeftBig"
      appear
      mode="out-in"
    >
      <ElForm
        class="pt-5"
        v-show="status.type === 'preview' && step === 1"
        :label-position="mode === 'default' ? 'right' : 'top'"
      >
        <ElFormItem label="题干">
          <PContentEditor class="full-width" v-model="modelValue.content" />
        </ElFormItem>
        <ElFormItem label="选项" v-if="modelValue.type === 'single-choice'">
          <POptionEdit class="full-width" type="single" v-model:options="modelValue.options" v-model:single="modelValue.answer" />
        </ElFormItem>
        <ElFormItem label="选项" v-if="modelValue.type === 'multiple-choice'">
          <POptionEdit class="full-width" type="multiple" v-model:options="modelValue.options" v-model:multiple="modelValue.answer" />
        </ElFormItem>
        <ElFormItem label="选项" v-if="modelValue.type === 'judge'">
          <POptionEdit class="full-width" type="judge" v-model:judge="modelValue.answer" />
        </ElFormItem>
        <ElFormItem v-if="modelValue.type === 'answer'" label="答案">
          <PContentEditor class="full-width" v-model="modelValue.answer" />
        </ElFormItem>
        <ElFormItem label="解答">
          <PContentEditor
            class="full-width"
            v-model="modelValue.details.procedure"
          />
        </ElFormItem>
        <ElFormItem label="分析">
          <ElInput
            type="textarea"
            :disabled="level !== 0"
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="modelValue.details.analytical"
            placeholder="请输入题目方法分析（于创建题目非小题时填写）"
          />
        </ElFormItem>
        <ElFormItem label="点评" :disabled="level !== 0">
          <ElInput
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="modelValue.details.comment"
            :disabled="level !== 0"
            placeholder="请输入题目点评（于创建题目非小题时填写）"
          />
        </ElFormItem>
        <ElFormItem label="标签">
          <ElSelect
            class="full-width"
            multiple
            :disabled="level !== 0"
            filterable
            allow-create
            no-data-text="请输入以创建"
            placeholder="请输入标签（于创建题目非小题时填写）"
            default-first-option
            v-model="modelValue.details.tags"
            :reserve-keyword="false"
          >
            <ElOption
              v-for="item in tags"
              :key="item"
              :label="item"
              :value="item"
            />
          </ElSelect>
        </ElFormItem>
        <!-- <ElFormItem label="错题">
          <ElCard shadow="hover" class="full-width">
            <ElForm>
              <ElFormItem label="类型" class="py-2">
                <ElSelect
                  v-model="modelValue.wrong.type"
                  placeholder="请选择错题类型"
                  class="full-width"
                >
                  <ElOption
                    v-for="item in wrongTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="!item.subjects.includes(modelValue.data.subject)"
                  />
                </ElSelect>
              </ElFormItem>
              <ElFormItem label="原因" class="py-2">
                <PContentEditor
                  v-model="modelValue.wrong.reason"
                  placeholder="请输入错题原因"
                  :disables="[
                    'article',
                    'code',
                    'image',
                    'material',
                    'problem',
                    'table',
                    'textarea',
                  ]"
                />
              </ElFormItem>
              <ElFormItem label="总结" class="py-2">
                <PContentEditor
                  v-model="modelValue.wrong.lesson"
                  placeholder="请输入错题总结"
                  :disables="[
                    'article',
                    'code',
                    'material',
                    'problem',
                    'table',
                  ]"
                />
              </ElFormItem>
            </ElForm>
          </ElCard>
        </ElFormItem> -->
      </ElForm>
    </transition>
    <transition
      enter-active-class="animate__animated animate__fadeInRightBig"
      leave-active-class="animate__animated animate__fadeOutLeftBig"
      appear
      mode="out-in"
    >
      <ElForm
        v-if="status.type === 'preview' && step === 2"
        label-position="top"
        class="pt-5"
      >
        <ElFormItem label="题目预览">
          <PProblem
            class="full-width pt-5"
            :problem="modelValue"
            mode="display"
            :order="1"
            :level="level"
            preview
          />
        </ElFormItem>
        <ElFormItem
          v-if="
            ((modelValue.type === 'blank' || modelValue.type === 'answer') &&
              modelValue._id) ||
            mode !== 'default'
          "
          label="子题添加"
        >
          <ElCard class="full-width" shadow="never">
            <div style="text-align: right">
              <ElButton
                text
                bg
                circle
                size="small"
                type="danger"
                :icon="Delete"
                :disabled="modelValue.subProblems.length <= 0"
                @click="removeSubProblem"
              />
              <ElButton
                text
                bg
                circle
                size="small"
                type="success"
                :icon="Plus"
                @click="createSubProblem"
              />
            </div>
            <ElDivider />
            <div
              class="px-2 py-2"
              v-for="(subp, idx) in modelValue.subProblems"
              :key="idx"
            >
              <PProblem
                v-if="!subProblems[idx]"
                class="full-width"
                :problem="subp.problem"
                mode="display"
                :level="level + 1"
                :order="idx + 1"
                @dblclick="subProblems[idx] = true"
              />
              <p v-else class="px-2">编辑中……</p>
              <ElDrawer
                v-model="subProblems[idx]"
                direction="rtl"
                :size="100 * 0.8 ** (level + 1) + '%'"
                @before-close="subProblems[idx] = false"
              >
                <template #default>
                  <PCreateProblem
                    v-model="modelValue.subProblems[idx].problem"
                    :level="level + 1"
                    :id="modelValue._id + '-' + (idx + 1)"
                    @insert="subProblems[idx] = false"
                    :mode="mode"
                  />
                </template>
              </ElDrawer>
            </div>
          </ElCard>
        </ElFormItem>
        <ElFormItem label="上传操作">
          <ElButton
            v-if="level === 0"
            :type="modelValue._id === '' ? 'primary' : 'warning'"
            class="full-width"
            text
            bg
            :icon="Save"
            @click="handleSubmit"
          >
            {{ modelValue._id === '' ? '确认无误，上传题目' : '保存修改结果' }}
          </ElButton>
        </ElFormItem>
      </ElForm>
    </transition>
    <ElRow class="px-4 pt-4">
      <ElCol :span="12" class="text-left">
        <ElButton
          circle
          size="large"
          text
          bg
          :type="step === 0 ? 'danger' : 'primary'"
          :icon="ArrowLeft"
          :disabled="step === 0"
          @click="step--"
        />
      </ElCol>
      <ElCol :span="12" class="text-right">
        <ElButton
          circle
          size="large"
          text
          bg
          :type="step === 2 ? 'success' : 'primary'"
          :icon="ArrowRight"
          @click="step++"
        />
      </ElCol>
    </ElRow>
  </div>
</template>

<style scoped>
.full-width {
  width: 100%;
}
.animate__fadeOutLeftBig {
  position: absolute;
}
</style>
