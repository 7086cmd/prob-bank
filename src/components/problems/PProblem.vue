<script lang="ts" setup>
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
  ElDrawer,
} from 'element-plus'
import PJudgeProblem from './PJudgeProblem.vue'
import PChoiceProblem from './PChoiceProblem.vue'
import PBlankProblem from './PBlankProblem.vue'
import PAnswerProblem from './PAnswerProblem.vue'
import {
  View,
  Download,
  Plus,
  Edit,
  Delete,
  DataAnalysis,
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
import { getGradeSubjectName } from '@/utils/subject'
import Clipboard from 'clipboard'
import { deleteProblem } from '@/api'
import { getProblemGroup } from '@/api'
import { getWrongType } from './wrong'
import dayjs from 'dayjs'

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
  groupPreview?: boolean
  answer?: Content[]
}>()

const { problem, mode, order, level, _id, inPaper, preview, groupPreview } =
  toRefs(props)
const valid = ref(false)
const groupinform = ref<Content[]>([])
const hoveredViewGroup = ref(false)

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
    getProblemGroup(problem.value.inGroup).then((resp) => {
      if (resp) {
        groupinform.value = (resp as ProblemGroup).prompts
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

const { fontSize } = toRefs(status)

const showWrong = ref(false)
</script>

<template>
  <div class="pt-4" content="Problem Bank">
    <transition
      v-if="mode === 'display' && status.type === 'preview'"
      enter-active-class="animate__animated animate__fadeIn"
      appear
    >
      <ElCard shadow="hover">
        <PJudgeProblem
          v-if="problem.type === 'judge'"
          :type="mode"
          :problem="problem"
          :order="order"
          :level="level"
        />
        <PChoiceProblem
          v-else-if="
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
          :level="(level as 0 | 1)"
          :preview="preview"
        />
        <span v-else>没有这种类型的题目</span>
        <transition
          enter-active-class="animate__animated animate__fadeInDown"
          appear
        >
          <div v-if="valid && !groupPreview" style="text-align: right">
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
      <PJudgeProblem
        v-if="problem.type === 'judge'"
        :type="mode"
        :problem="problem"
        :order="order"
        :level="level"
      />
      <PChoiceProblem
        v-else-if="
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
        :order="(order as number)"
        :level="(level as 0 | 1)"
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
        <ElCol :span="21"><PContent :content="(answer as Content[])" /></ElCol>
      </ElRow>
      <ElRow v-if="status.dispMode === 'description' && level === 0">
        <ElCol :span="3" class="black">解析</ElCol>
        <ElCol :span="21"
          ><PContent :content="problem.details.procedure"
        /></ElCol>
      </ElRow>
      <div
        v-if="
          status.dispMode === 'wrong' &&
          level === 0 &&
          Boolean(problem.wrong) &&
          Boolean(problem.wrong?.type)
        "
      >
        <ElRow>
          <ElCol :span="3" class="black">错题分类</ElCol>
          <ElCol :span="21">
            <PContent
              :content="[
                {
                  type: 'text',
                  content: `${getWrongType(problem.wrong?.type as string)}`,
                },
              ]"
            />
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="3" class="black">错题原因</ElCol>
          <ElCol :span="21">
            <PContent :content="(problem.wrong?.reason as Content[])" />
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="3" class="black">错题总结</ElCol>
          <ElCol :span="21">
            <PContent :content="(problem.wrong?.lesson as Content[])" />
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="3" class="black">错题答案</ElCol>
          <ElCol :span="21">
            <PContent :content="(answer as Content[])" />
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="3" class="black">错题重做</ElCol>
          <ElCol :span="21">
            <PContent
              :content="[{ type: 'text', content: '请做在上面题目的空格中' }]"
            />
          </ElCol>
        </ElRow>
      </div>
    </div>
    <transition
      v-else-if="mode === 'page'"
      enter-active-class="animate__animated animate__fadeInDown"
      appear
    >
      <div>
        <ElDrawer
          v-model="showWrong"
          direction="btt"
          size="40%"
          title="错题明细"
        >
          <div class="px-6">
            <PContent
              :content="[{ type: 'text', content: '1．错题分类：' }]"
              title
            />
            <PContent
              :content="[
                { type: 'text', content: getWrongType(problem.wrong?.type as string) },
              ]"
              title
            />
            <br />
            <PContent
              v-if="problem.wrong?.reason"
              :content="[{ type: 'text', content: '2．错题原因：' }]"
              title
            />
            <PContent
              v-if="problem.wrong?.reason"
              :content="problem.wrong?.reason"
              author
              :science="
                ['Chemistry', 'Physics', 'Mathmatics'].includes(
                  problem.data.subject
                )
              "
            />
            <br />
            <PContent
              v-if="problem.wrong?.lesson"
              :content="[{ type: 'text', content: '3．错题总结：' }]"
              title
            />
            <PContent
              v-if="problem.wrong?.lesson"
              :content="problem.wrong?.reason"
              :science="
                ['Chemistry', 'Physics', 'Mathmatics'].includes(
                  problem.data.subject
                )
              "
            />
          </div>
        </ElDrawer>
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
            :icon="DataAnalysis"
            type="info"
            @click="
              showWrong = Boolean(problem.wrong) && Boolean(problem.wrong?.type)
            "
            >错题明细</ElButton
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
        <ElCard
          shadow="hover"
          v-if="groupinform.length !== 0"
          class="origin"
          @mouseover="hoveredViewGroup = true"
          @mouseleave="hoveredViewGroup = false"
        >
          <ElRow>
            <ElCol :span="3" class="black">题组信息</ElCol>
            <ElCol :span="21">
              <div style="text-align: right">
                <ElButton
                  text
                  type="info"
                  :bg="hoveredViewGroup"
                  :round="hoveredViewGroup"
                  :circle="!hoveredViewGroup"
                  @click="
                    router.push(`/problem-group/display/${problem.inGroup}`)
                  "
                  :icon="View"
                >
                  <span v-if="hoveredViewGroup"> 查看所在题组 </span>
                </ElButton>
              </div>
            </ElCol>
          </ElRow>
          <span class="px-4" />
          <PContent :content="groupinform" prompt />
        </ElCard>
        <PJudgeProblem
          v-if="problem.type === 'judge'"
          :type="mode"
          :problem="problem"
          :order="order"
          :level="level"
        />
        <PChoiceProblem
          v-else-if="
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
          :level="(level as 0 | 1)"
          :preview="preview"
        />
        <span v-else>没有这种类型的题目</span>

        <ElForm class="pt-4">
          <ElRow>
            <ElCol :span="11">
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
            </ElCol>
            <ElCol :span="2"></ElCol>
            <ElCol :span="11">
              <ElFormItem label="来源">
                <PContent
                  :content="[{ type: 'text', content: problem.data.origin }]"
                  :science="
                    ['Chemistry', 'Physics', 'Mathmatics'].includes(
                      problem.data.subject
                    )
                  "
                />
              </ElFormItem>
            </ElCol>
          </ElRow>
          <ElRow>
            <ElCol :span="11">
              <ElFormItem label="考点">
                <ElTag
                  v-for="tag in problem.details.tags"
                  :key="tag"
                  effect="plain"
                >
                  {{ tag }}
                </ElTag>
              </ElFormItem>
            </ElCol>
            <ElCol :span="2"></ElCol>
            <ElCol :span="11">
              <ElFormItem label="分类">
                <span class="origin">{{
                  getGradeSubjectName(problem.data.level, problem.data.subject)
                }}</span>
              </ElFormItem>
            </ElCol>
          </ElRow>
          <ElRow>
            <ElCol :span="11">
              <ElFormItem label="答案">
                <PContent
                  :content="(answer as Content[])"
                  :science="
                    ['Chemistry', 'Physics', 'Mathmatics'].includes(
                      problem.data.subject
                    )
                  "
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="2"></ElCol>
            <ElCol :span="11">
              <ElFormItem label="点评">
                <PContent
                  :content="[
                    { type: 'text', content: problem.details.comment },
                  ]"
                  :science="
                    ['Chemistry', 'Physics', 'Mathmatics'].includes(
                      problem.data.subject
                    )
                  "
                />
              </ElFormItem>
            </ElCol>
          </ElRow>
          <ElRow>
            <ElCol :span="11">
              <ElFormItem label="解答">
                <PContent
                  :content="problem.details.procedure"
                  :science="
                    ['Chemistry', 'Physics', 'Mathmatics'].includes(
                      problem.data.subject
                    )
                  "
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="2"></ElCol>
            <ElCol :span="11">
              <ElFormItem label="分析">
                <PContent
                  :content="[
                    { type: 'text', content: problem.details.analytical },
                  ]"
                  :science="
                    ['Chemistry', 'Physics', 'Mathmatics'].includes(
                      problem.data.subject
                    )
                  "
                />
              </ElFormItem>
            </ElCol>
          </ElRow>

          <ElRow>
            <ElCol :span="11">
              <ElFormItem label="创建日期">
                {{ dayjs(problem.createdAt).format('YYYY-MM-DD YY:mm:ss') }}
              </ElFormItem>
            </ElCol>
            <ElCol :span="2"></ElCol>
            <ElCol :span="11">
              <ElFormItem label="修改日期">
                {{ dayjs(problem.updatedAt).format('YYYY-MM-DD YY:mm:ss') }}
              </ElFormItem>
            </ElCol>
          </ElRow>
        </ElForm>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.black {
  /* 思源黑体 */
  font-family: 'Source Han Sans SC';
  font-size: v-bind(fontSize + 'px');
}
</style>
