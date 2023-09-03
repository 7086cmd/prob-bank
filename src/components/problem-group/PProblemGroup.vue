<script lang="ts" setup>
/* global defineProps */
// @ts-nocheck
import { toRefs, ref } from 'vue'
import type { ProblemGroup } from '@/../@types/problem-group'
import {
  ElButton,
  ElCard,
  ElDivider,
  ElLoading,
  ElNotification,
  ElPopconfirm,
  ElSpace,
} from 'element-plus'
import { usePaperStore } from '@/stores/paper'
import { useStatusStore } from '@/stores/status'
import PContent from '../content/PContent.vue'
import PDisplayProblem from '../problems/PDisplayProblem.vue'
import PProblem from '../problems/PProblem.vue'
import { useRouter } from 'vue-router'
import {
  View,
  Delete,
  Plus,
  Download,
  Edit,
  Refresh,
  SortUp,
  SortDown,
  Close,
} from '@element-plus/icons-vue'
import { deleteProblemGroup } from '@/api'

const status = useStatusStore()
const paper = usePaperStore()
const router = useRouter()

const props = defineProps<{
  group: ProblemGroup
  order: number
  mode: 'page' | 'display'
  inPaper: boolean
}>()

const { group, order, mode, inPaper } = toRefs(props)
const { fontSize } = toRefs(status)

const _id = group.value._id

const valid = ref(false)

if (window.probbank.validObjectId(_id)) valid.value = true

function createProblemGroupDownloader(_id: string) {
  const loader = ElLoading.service({
    text: '正在下载题组',
  })
  const data = group.value
  const blob = new Blob([JSON.stringify(data)], {
    type: 'application/json',
  })
  const url = window.URL.createObjectURL(blob)
  loader.close()
  const link = document.createElement('a')
  link.href = url
  link.download = `problem-group-${_id}.json`
  link.click()
  window.URL.revokeObjectURL(url)
}

async function deleteGroup(_id: string) {
  const result = await deleteProblemGroup(_id)
  if (result) {
    ElNotification({
      title: '删除成功',
      type: 'success',
    })
    router.push('/problem-group')
  }
}

function exists() {
  return paper.existsItem('problem-group', group.value._id)
}

function set() {
  paper.setItem('problem-group', group.value._id)
}

function remove() {
  paper.removeItem('problem-group', group.value._id)
}

function handle() {
  if (exists()) remove()
  else set()
}
</script>

<template>
  <div class="pt-4">
    <transition
      v-if="mode === 'display' && status.type === 'preview'"
      enter-active-class="animate__animated animate__fadeIn"
      appear
    >
      <ElCard shadow="hover">
        <span class="description" v-if="group.data.origin">
          （{{ group.data.origin }}）
        </span>
        <PContent
          :content="[
            {
              type: 'text',
              content: `根据材料，回答第${order}至${
                order + group.problems.length - 1
              }题。`,
            },
          ]"
        />
        <br />
        <!-- eslint-disable-next-line no-irregular-whitespace -->
        <span>　　</span><PContent :content="group.prompts" prompt />
        <div v-if="group.type === 'removable'">
          <PDisplayProblem
            v-for="(prob, index) in group.problems"
            :key="prob"
            :order="order + index"
            :level="0"
            :mode="mode"
            :_id="prob"
          />
        </div>
        <div v-else-if="group.type === 'unremovable'">
          <PProblem
            v-for="(prob, index) in group.problems"
            :key="prob._id"
            :order="order + index"
            :level="0"
            :mode="mode"
            :problem="prob"
            :_id="prob._id"
          />
        </div>
        <ElDivider v-if="status.type === 'preview'" />
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
                @click="paper.descend('problem-group', _id as string)"
              />
              <ElButton
                v-if="inPaper"
                size="small"
                text
                bg
                circle
                :icon="SortUp"
                type="primary"
                @click="paper.ascend('problem-group', _id as string)"
              />
              <ElButton
                v-if="inPaper"
                size="small"
                text
                bg
                circle
                :icon="Refresh"
                type="success"
                @click="paper.refresh('problem-group', _id as string)"
              />
              <ElDivider v-if="inPaper" direction="vertical" />
              <ElButton
                size="small"
                text
                bg
                circle
                :icon="View"
                type="info"
                @click="router.push(`/problem-group/display/${_id}`)"
              />
              <ElButton
                size="small"
                text
                bg
                circle
                :icon="Edit"
                type="primary"
                @click="router.push(`/problem-group/modify/${_id}`)"
              />
              <ElButton
                size="small"
                text
                bg
                circle
                :icon="Download"
                type="warning"
                @click="createProblemGroupDownloader(_id as string)"
              />
              <ElButton
                size="small"
                text
                bg
                circle
                :icon="exists() ? Close : Plus"
                :type="exists() ? 'danger' : 'success'"
                :disabled="!_id || _id.includes('-')"
                @click="handle()"
              />
            </ElSpace>
          </div>
        </transition>
      </ElCard>
    </transition>
    <transition v-else-if="mode === 'page' && status.type === 'preview'">
      <div>
        <div
          v-if="status.type === 'preview'"
          style="text-align: right"
          class="py-4"
        >
          <ElButton
            text
            bg
            round
            :icon="Download"
            type="primary"
            @click="createProblemGroupDownloader(_id as string)"
            >下载</ElButton
          >
          <ElButton
            text
            bg
            round
            :icon="Edit"
            type="warning"
            @click="router.push(`/problem-group/modify/${_id}`)"
            >修改</ElButton
          >
          <ElButton
            text
            bg
            round
            :icon="exists() ? Close : Plus"
            :type="exists() ? 'danger' : 'success'"
            :disabled="
              exists() &&
              paper.elements.filter((x) => x.type.includes('problem')).length >=
                45
            "
            @click="handle()"
          >
            {{ exists() ? '从组卷中删除' : '添加至组卷' }}
          </ElButton>
          <ElPopconfirm
            title="确定要删除吗？"
            confirmButtonText="确定"
            cancelButtonText="取消"
            type="danger"
            @confirm="deleteGroup"
          >
            <template #reference>
              <ElButton text bg round :icon="Delete" type="danger">
                删除
              </ElButton>
            </template>
          </ElPopconfirm>
        </div>
        <div>
          <PContent :content="group.prompts" prompt />
          <div v-if="group.type === 'removable'">
            <PDisplayProblem
              v-for="(prob, index) in group.problems"
              :key="prob"
              :order="order + index"
              :level="0"
              mode="display"
              :_id="prob"
            />
          </div>
          <div v-else-if="group.type === 'unremovable'">
            <PProblem
              v-for="(prob, index) in group.problems"
              :key="prob._id"
              :order="order + index"
              :level="0"
              :mode="mode"
              :problem="prob"
              :_id="prob._id"
            />
          </div>
        </div>
      </div>
    </transition>
    <div v-else-if="status.type === 'print'">
      <span class="description" v-if="group.data.origin">
        （{{ group.data.origin }}）
      </span>
      <PContent :content="group.prompts" prompt />
      <div v-if="group.type === 'removable'">
        <PDisplayProblem
          v-for="(prob, index) in group.problems"
          :key="prob"
          :order="order + index"
          :level="0"
          mode="display"
          :_id="prob"
        />
      </div>
      <div v-else-if="group.type === 'unremovable'">
        <PProblem
          v-for="(prob, index) in group.problems"
          :key="prob._id"
          :order="order + index"
          :level="0"
          :mode="mode"
          :problem="prob"
          :_id="prob._id"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.description {
  font-family: '方正仿宋' !important;
  font-size: v-bind((fontSize + 1) + 'px');
}
</style>
