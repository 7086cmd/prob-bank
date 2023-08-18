<script lang="ts" setup>
// @ts-nocheck
/* global defineProps */
/* eslint-disable vue/no-deprecated-filter */
import type { AllProblem } from '@/../@types/problem'
import { ref, toRefs } from 'vue'
import { useStatusStore } from '@/stores/status'
import {
  ElButton,
  ElCard,
  ElDivider,
  ElPopconfirm,
  ElNotification,
  ElLoading,
  ElForm,
  ElFormItem,
  ElSpace,
  ElRow,
  ElCol,
} from 'element-plus'
import PChoiceProblem from './PChoiceProblem.vue'
import PBlankProblem from './PBlankProblem.vue'
import PAnswerProblem from './PAnswerProblem.vue'
import {
  View,
  Download,
  Plus,
  Edit,
  Delete,
  ArrowLeft,
  Close,
  SortUp,
  SortDown,
  Refresh,
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { isValidObjectId } from '@/utils/apis'
import type { Content } from '@/../@types/content'
import type { ProblemGroup } from '@/../@types/problem-group'
import PContent from '../content/PContent.vue'
import { usePaperStore } from '@/stores/paper'
import { getAnswer } from './answer/getAnswer'
import { getGradeSubjectName } from '@/utils/subject'
import Clipboard from 'clipboard'
import { deleteProblem } from '@/api'
import { md2c } from '@/utils/md2c'

const paper = usePaperStore()
const status = useStatusStore()
const router = useRouter()
const clipboard = new Clipboard('.copy')

if (import.meta.env.PROD)
  clipboard.on('success', () => {
    ElNotification({
      title: '复制成功',
      type: 'success',
    })
  })

const props = defineProps<{
  problem: AllProblem
  mode: 'display' | 'page'
  order?: number
  level: 0 | 1 | 2 // 0 为“．”，总序号；1 为“（）”，小题；2 为圈（如“①”），“圈1”、“圈2”．
  _id?: string
  inPaper?: boolean
  preview?: boolean
}>()

const { problem, mode, order, level, _id, inPaper, preview } = toRefs(props)
const valid = ref(false)
const groupinform = ref<Content[]>([])

if (
  ['Mathmatics', 'Physics', 'Chemistry'].includes(problem.value.data.subject)
) {
  problem.value.content.map((item) => {
    if (item.type === 'text') {
      item.content = item.content.replaceAll('。', '．')
    }
  })
}

isValidObjectId(_id?.value).then((resp) => (valid.value = resp))

function handleDeleteProblem() {
  deleteProblem(_id?.value as string)
    .then(() => {
      ElNotification({
        title: '删除成功',
        type: 'success',
      })
      router.back()
    })
    .catch((err) => {
      ElNotification({
        title: '删除失败',
        message: err.response.data.message,
        type: 'error',
      })
    })
}

function createProblemDownloader(_id: string) {
  const loader = ElLoading.service({
    text: '正在下载题目',
  })
  const data = problem.value
  const blob = new Blob([JSON.stringify(data)], {
    type: 'application/json',
  })
  const url = window.URL.createObjectURL(blob)
  loader.close()
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.download = `problem-${_id}.json`
  document.body.appendChild(link)
  link.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(link)
}

function inGroup() {
  if (problem.value.inGroup) {
    window.probbank
      .request({
        pathname: 'problem-group',
        method: 'get',
        request: {
          params: {
            _id: problem.value.inGroup,
          },
        },
      })
      .then((resp) => {
        if (resp.status === 'success') {
          groupinform.value = (resp.data as ProblemGroup).prompts
        }
      })
  }
}

inGroup()

function exists(_id: string) {
  return paper.existsItem('problem', _id)
}

function set(_id: string) {
  paper.setItem('problem', _id)
}

function remove(_id: string) {
  paper.removeItem('problem', _id)
}

function handle(_id: string) {
  if (exists(_id)) remove(_id)
  else set(_id)
}

const answer = ref((inPaper.value || mode.value === 'page') ? md2c(getAnswer(problem.value)) : '')
</script>

<template>
  <div class="pt-4" content="Problem Bank">
    <transition
      v-if="mode === 'display' && status.type === 'preview'"
      enter-active-class="animate__animated animate__fadeIn"
      appear
    >
      <ElCard shadow="hover">
        <PChoiceProblem
          v-if="
            problem.type === 'single-choice' ||
            problem.type === 'multiple-choice'
          "
          :type="mode"
          :problem="problem"
          :order="order"
          :level="level"
        />
        <PBlankProblem
          v-else-if="problem.type === 'blank'"
          :type="mode"
          :problem="problem"
          :order="order"
          :level="level"
          :preview="preview"
        />
        <PAnswerProblem
          v-else-if="problem.type === 'answer'"
          :type="mode"
          :problem="problem"
          :order="order"
          :level="level"
          :preview="preview"
        />
        <span v-else>没有这种类型的题目</span>
        <transition
          enter-active-class="animate__animated animate__fadeInDown"
          appear
        >
          <div v-if="valid" style="text-align: right">
            <ElDivider />
            <ElSpace>
              <ElButton
                v-if="inPaper"
                size="small"
                text
                bg
                circle
                :icon="SortDown"
                type="primary"
                @click="paper.descend('problem', _id as string)"
              />
              <ElButton
                v-if="inPaper"
                size="small"
                text
                bg
                circle
                :icon="SortUp"
                type="primary"
                @click="paper.ascend('problem', _id as string)"
              />
              <ElButton
                v-if="inPaper"
                size="small"
                text
                bg
                circle
                :icon="Refresh"
                type="success"
                @click="paper.refresh('problem', _id as string)"
              />
              <ElDivider v-if="inPaper" direction="vertical" />
              <ElButton
                size="small"
                text
                bg
                circle
                :icon="View"
                type="info"
                @click="router.push(`/problem/display/${_id}`)"
              />
              <ElButton
                size="small"
                text
                bg
                circle
                :icon="Edit"
                type="primary"
                @click="router.push(`/problem/modify/${_id}`)"
              />
              <ElButton
                size="small"
                text
                bg
                circle
                :icon="Download"
                type="warning"
                @click="createProblemDownloader(_id as string)"
              />
              <ElButton
                size="small"
                text
                bg
                circle
                :icon="exists(_id as string) ? Close : Plus"
                :type="exists(_id as string) ? 'danger' : 'success'"
                :disabled="!_id || _id.includes('-')"
                @click="handle(_id as string)"
              />
            </ElSpace>
          </div>
        </transition>
      </ElCard>
    </transition>
    <div v-else-if="mode === 'display' && status.type === 'print'" style="px-4">
      <PChoiceProblem
        v-if="
          problem.type === 'single-choice' || problem.type === 'multiple-choice'
        "
        :type="mode"
        :problem="problem"
        :order="order"
        :level="level"
      />
      <PBlankProblem
        v-else-if="problem.type === 'blank'"
        :type="mode"
        :problem="problem"
        :order="order"
        :level="level"
        :preview="preview"
      />
      <PAnswerProblem
        v-else-if="problem.type === 'answer'"
        :type="mode"
        :problem="problem"
        :order="order"
        :level="level"
        :preview="preview"
      />
      <span v-else>没有这种类型的题目</span>
      <ElRow
        v-if="
          (status.dispMode === 'teacher' ||
            status.dispMode === 'description') &&
          level === 0
        "
      >
        <ElCol :span="3" class="black">答案</ElCol>
        <ElCol :span="21"><PContent :content="answer" /></ElCol>
      </ElRow>
      <ElRow v-if="status.dispMode === 'description' && level === 0">
        <ElCol :span="3" class="black">解析</ElCol>
        <ElCol :span="21"
          ><PContent :content="problem.details.procedure"
        /></ElCol>
      </ElRow>
    </div>
    <transition
      v-else-if="mode === 'page'"
      enter-active-class="animate__animated animate__fadeInDown"
      appear
    >
      <div>
        <div
          v-if="status.type === 'preview'"
          style="text-align: right"
          class="py-4"
        >
          <ElButton
            v-if="problem.inGroup"
            text
            bg
            round
            :icon="ArrowLeft"
            type="info"
            @click="router.push('/problem-group/display/' + problem.inGroup)"
            >查看所在题组</ElButton
          >
          <ElButton
            text
            bg
            round
            :icon="Download"
            type="primary"
            @click="createProblemDownloader(_id as string)"
            >下载</ElButton
          >
          <ElButton
            text
            bg
            round
            :icon="Edit"
            type="warning"
            @click="router.push(`/problem/modify/${_id}`)"
            >修改</ElButton
          >
          <ElButton
            text
            bg
            round
            :icon="exists(_id as string) ? Close : Plus"
            :type="exists(_id as string) ? 'danger' : 'success'"
            :disabled="!_id || _id.includes('-')"
            @click="handle(_id as string)"
          >
            {{ exists(_id as string) ? '从组卷中删除' : '添加至组卷' }}
          </ElButton>
          <ElPopconfirm
            title="确定要删除吗？"
            confirmButtonText="确定"
            cancelButtonText="取消"
            type="danger"
            @confirm="handleDeleteProblem"
          >
            <template #reference>
              <ElButton text bg round :icon="Delete" type="danger">
                删除
              </ElButton>
            </template>
          </ElPopconfirm>
        </div>
        <span
          v-if="groupinform.length !== 0"
          style="color: #666666"
          class="origin"
        >
          （题组材料）
          <PContent :content="groupinform" />
        </span>
        <PChoiceProblem
          v-if="
            problem.type === 'single-choice' ||
            problem.type === 'multiple-choice'
          "
          :type="mode"
          :problem="problem"
          :order="order"
          :level="level"
        />
        <PBlankProblem
          v-else-if="problem.type === 'blank'"
          :type="mode"
          :problem="problem"
          :order="order"
          :level="level"
          :preview="preview"
        />
        <PAnswerProblem
          v-else-if="problem.type === 'answer'"
          :type="mode"
          :problem="problem"
          :order="order"
          :level="level"
          :preview="preview"
        />
        <span v-else>没有这种类型的题目</span>

        <ElForm class="pt-4">
          <ElFormItem label="编号">
            <ElButton
              class="copy"
              text
              bg
              type="primary"
              size="small"
              :data-clipboard-text="problem._id"
              >{{ problem._id }}</ElButton
            >
          </ElFormItem>
          <ElFormItem label="来源">
            <PContent
              :content="[{ type: 'text', content: problem.data.origin }]"
            />
          </ElFormItem>
          <ElFormItem label="考点">
            <ElTag
              v-for="tag in problem.details.tags"
              :key="tag"
              effect="plain"
            >
              {{ tag }}
            </ElTag>
          </ElFormItem>
          <ElFormItem label="分类">
            <span class="origin">{{
              getGradeSubjectName(problem.data.level, problem.data.subject)
            }}</span>
          </ElFormItem>
          <ElFormItem label="答案">
            <PContent :content="answer" />
          </ElFormItem>
          <ElFormItem label="解答">
            <PContent :content="problem.details.procedure" />
          </ElFormItem>
          <ElFormItem label="分析">
            <PContent
              :content="[{ type: 'text', content: problem.details.analytical }]"
            />
          </ElFormItem>
          <ElFormItem label="点评">
            <PContent
              :content="[{ type: 'text', content: problem.details.comment }]"
            />
          </ElFormItem>
          <ElFormItem label="创建日期">
            {{ problem.createdAt }}
          </ElFormItem>
          <ElFormItem label="修改日期">
            {{ problem.updatedAt }}
          </ElFormItem>
        </ElForm>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.black {
  /* 思源黑体 */
  font-family: 'Source Han Sans SC';
  font-size: 13px;
}
</style>
