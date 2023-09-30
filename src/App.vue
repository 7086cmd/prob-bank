<script lang="ts" setup>
// @ts-nocheck
import {
  ElContainer,
  ElAside,
  ElHeader,
  ElMain,
  ElFooter,
  ElDivider,
  ElCol,
  ElRow,
  ElButton,
  ElLoading,
  ElAffix,
  ElSpace,
  ElPopconfirm,
  ElDropdown,
  ElDropdownMenu,
  ElTooltip,
  ElIcon,
  ElNotification,
  ElSwitch,
  ElPopover,
  ElForm,
  ElSelect,
  ElOption,
  ElFormItem,
} from 'element-plus'
import { useDark, useWindowSize } from '@vueuse/core'
import {
  Moon,
  Sunny,
  Setting,
  View,
  Hide,
  Document,
  DocumentAdd,
  Close,
  Download,
  Edit,
  Refresh,
  Printer,
  Minus,
  Plus,
  FullScreen,
  ArrowLeft,
  DataAnalysis,
  DataBoard,
} from '@element-plus/icons-vue'
import Dayjs from 'dayjs'
import { ref, watch, toRefs, onMounted } from 'vue'
import { useStatusStore } from './stores/status'
import { useRouter, useRoute } from 'vue-router'
import { usePaperStore } from './stores/paper'
import dialogs from '@/plugins/dialogs'

const status = useStatusStore()
const router = useRouter()
const route = useRoute()
const paper = usePaperStore()

const darkmode = useDark()

function showSizeChange() {
  const loading = ElLoading.service({
    lock: true,
    text: `正在调整窗口尺寸：${width.value}×${height.value}`,
    background: '#efefef',
  })

  setTimeout(() => {
    loading.close()
  }, 1200)
}

const { width, height } = useWindowSize()

const wrong = ref(false)
const mode = ref('student')

const modes = [
  {
    value: 'student',
    label: '学生版',
  },
  {
    value: 'teacher',
    label: '教师版',
  },
  {
    value: 'description',
    label: '解析版',
  },
  {
    value: 'answer',
    label: '答案版',
  },
  {
    value: 'wrong',
    label: '错题本专用版',
  },
]

watch(width, () => {
  showSizeChange()
})

watch(height, () => {
  showSizeChange()
})

const tpColor = ref(darkmode.value ? '#141414' : '#ffffff')
const tpRadius = ref(darkmode.value ? '6px' : '4px')

watch(darkmode, () => {
  tpColor.value = darkmode.value ? '#141414' : '#ffffff'
  tpRadius.value = darkmode.value ? '6px' : '4px'
})

onMounted(() => {
  const url = new URL(window.location.href)
  const params = url.searchParams
  const method = params.get('mode') as
    | 'student'
    | 'teacher'
    | 'description'
    | 'answer'
  // console.log(method)
  if (method) {
    const taskId = params.get('id') as string
    status.useDisplayMode(method)
    console.log(taskId, 'Print It!')
    window.probbank.send('print-step', taskId)
  }
})

function usePrintToPDF(
  mode: 'student' | 'teacher' | 'description' | 'answer' | 'wrong'
) {
  const loading = ElLoading.service({
    lock: true,
    text:
      '正在保存到 PDF（' +
      (mode === 'student'
        ? '学生版'
        : mode === 'teacher'
        ? '教师版'
        : mode === 'description'
        ? '解析版'
        : mode === 'wrong'
        ? '答案版'
        : '错题本专用版') +
      '）\n' +
      `——温馨提示：${dialogs.get()}`,
    background: '#efefef',
  })
  window.probbank.print(
    route.name === 'paper' ? paper.metadata.name : '',
    mode,
    () => {}
  )
  window.probbank.on('print-step', () => {
    loading.close()
    ElNotification({
      title: '已经保存到 PDF',
      type: 'success',
    })
  })
}

const date = ref(Dayjs().format('YYYY/MM/DD HH:mm:ss'))

setInterval(() => {
  date.value = Dayjs().format('YYYY/MM/DD HH:mm:ss')
}, 100)

const { fontSize } = toRefs(status)

const paperToolbar = ref(false)

const platform = window.probbank.os as string

const useWindowControls = (
  action: 'close' | 'minimize' | 'maximize' | 'fullscreen'
) => {
  window.probbank.actionBaseWindow(action)
}
</script>

<template>
  <ElContainer @contextmenu.prevent>
    <!-- {{ status.dispMode + ' & ' + status.type + ' & ' + (status.answer ? 'answer' : 'no answer') }} -->
    <ElHeader :style="{ userSelect: 'none' }">
      <ElAffix>
        <div class="header">
          <br />
          <ElRow>
            <ElCol
              :span="status.type === 'print' ? 12 : 8"
              class="pt-2"
              @dblclick="router.push('/home')"
            >
              <transition
                enter-active-class="animate__animated animate__fadeInDown"
                appear
              >
                <span :style="{ fontSize: '18px', opacity: 1 }">
                  <ElIcon><img src="@/assets/favicon.jpg" /></ElIcon> Problem
                  Bank
                  <span
                    v-if="status.type !== 'print'"
                    :style="{ fontSize: '10px' }"
                  >
                    Created by Wu Chengyu
                  </span>
                </span>
              </transition>
            </ElCol>
            <ElCol v-if="status.type !== 'print'" :span="4">
              <div :style="{ textAlign: 'center' }"></div>
            </ElCol>
            <ElCol
              v-if="status.type !== 'print'"
              :span="status.type === 'print' ? 18 : 12"
            >
              <transition
                enter-active-class="animate__animated animate__fadeInRight"
                appear
              >
                <div :style="{ textAlign: 'right' }">
                  <ElSpace>
                    <span
                      :style="{ fontSize: '12px' }"
                      v-if="status.type === 'print'"
                    >
                      {{ date }}
                    </span>
                    <Transition
                      enter-active-class="animate__animated animate__fadeInUp"
                      leave-active-class="animate__animated animate__fadeOutDown"
                      appear
                    >
                      <ElSpace v-if="paper._id !== '' && paperToolbar">
                        <ElPopconfirm
                          @confirm="paper.reset()"
                          title="确定重置试卷？"
                          confirmButtonText="确定"
                          cancelButtonText="取消"
                        >
                          <template #reference>
                            <ElButton
                              text
                              bg
                              circle
                              large
                              type="warning"
                              :icon="Refresh"
                            />
                          </template>
                        </ElPopconfirm>
                        <ElDropdown trigger="click">
                          <ElButton
                            text
                            bg
                            circle
                            large
                            type="success"
                            :icon="Download"
                          />
                          <template #dropdown>
                            <ElDropdownMenu>
                              <ElTooltip
                                content="仅包含数据库索引，体积小，且可以随数据库改变而改变"
                                :effect="darkmode ? 'dark' : 'light'"
                                placement="top"
                              >
                                <ElButton text @click="paper.save('index')">
                                  下载索引版
                                </ElButton>
                              </ElTooltip>
                              <br />
                              <ElTooltip
                                content="包含完整题目信息，体积较大，但是可以离线存储、跨数据库使用"
                                :effect="darkmode ? 'dark' : 'light'"
                                placement="bottom"
                              >
                                <ElButton text @click="paper.save('complete')">
                                  下载完整版
                                </ElButton>
                              </ElTooltip>
                            </ElDropdownMenu>
                          </template>
                        </ElDropdown>
                        <ElButton
                          text
                          bg
                          circle
                          large
                          type="primary"
                          :icon="Edit"
                          @click="router.push('/paper/modify')"
                        />
                      </ElSpace>
                    </Transition>
                    <ElButton
                      v-if="status.type !== 'print'"
                      text
                      bg
                      circle
                      large
                      :type="paperToolbar ? 'danger' : 'primary'"
                      :icon="
                        paperToolbar
                          ? Close
                          : paper._id === ''
                          ? DocumentAdd
                          : Document
                      "
                      @click="
                        paperToolbar
                          ? (paperToolbar = !paperToolbar)
                          : router.push(
                              paper._id === '' ? '/paper/modify' : '/paper'
                            )
                      "
                      @contextmenu="paperToolbar = !paperToolbar"
                    />
                    <ElButton
                      v-if="status.type !== 'print'"
                      type="info"
                      text
                      bg
                      circle
                      large
                      :icon="Setting"
                      @click="router.push('/settings/')"
                    />
                    <ElButton
                      :type="status.answer ? 'danger' : 'success'"
                      v-if="status.type !== 'print'"
                      text
                      bg
                      circle
                      large
                      :icon="status.answer ? Hide : View"
                      @click="status.toggleAnswer()"
                    />
                    <ElDivider
                      direction="vertical"
                      v-if="status.type !== 'print'"
                    />
                    <ElButton
                      text
                      bg
                      circle
                      large
                      type="primary"
                      :icon="ArrowLeft"
                      @click="router.back()"
                    />
                    <ElButton
                      v-if="status.type !== 'print'"
                      text
                      bg
                      circle
                      large
                      type="warning"
                      :icon="darkmode ? Sunny : Moon"
                      @click="darkmode = !darkmode"
                      disabled
                    />
                    <ElPopover trigger="hover" width="20%">
                      <template #reference>
                        <ElButton
                          v-if="status.type !== 'print'"
                          text
                          bg
                          circle
                          large
                          type="info"
                          :icon="Printer"
                        />
                      </template>
                      <ElForm>
                        <ElFormItem label="错题" class="py-2">
                          <ElSwitch
                            style="text-align: center"
                            v-model="wrong"
                            :inactive-action-icon="DataAnalysis"
                            :active-action-icon="DataBoard"
                          />
                        </ElFormItem>
                        <ElFormItem label="模式" class="py-2">
                          <ElSelect
                            v-model="mode"
                            class="full-width"
                            placeholder="请选择"
                          >
                            <ElOption
                              v-for="item in modes"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            />
                          </ElSelect>
                        </ElFormItem>
                        <div style="text-align: right">
                          <ElButton
                            type="primary"
                            text
                            bg
                            size="small"
                            @click="usePrintToPDF(mode, wrong)"
                          >
                            打印
                          </ElButton>
                        </div>
                      </ElForm>
                    </ElPopover>
                    <ElDivider
                      v-if="platform !== 'darwin' && status.type !== 'print'"
                      direction="vertical"
                    />
                    <ElButton
                      v-if="platform !== 'darwin' && status.type !== 'print'"
                      text
                      bg
                      circle
                      large
                      type="primary"
                      :icon="FullScreen"
                      @click="useWindowControls('fullscreen')"
                    />
                    <ElButton
                      v-if="
                        platform !== 'darwin' && status.type !== 'print'
                      "
                      text
                      bg
                      circle
                      large
                      type="warning"
                      :icon="Minus"
                      @click="useWindowControls('minimize')"
                    />
                    <ElButton
                      v-if="platform !== 'darwin' && status.type !== 'print'"
                      text
                      bg
                      circle
                      large
                      type="success"
                      :icon="Plus"
                      @click="useWindowControls('maximize')"
                    />
                    <ElButton
                      v-if="platform !== 'darwin' && status.type !== 'print'"
                      text
                      bg
                      circle
                      large
                      type="danger"
                      :icon="Close"
                      @click="useWindowControls('close')"
                    />
                  </ElSpace>
                </div>
              </transition>
            </ElCol>
          </ElRow>
          <ElDivider />
        </div>
      </ElAffix>
    </ElHeader>
    <ElMain class="pt-2 px-6">
      <ElContainer>
        <ElAside v-if="status.type === 'preview'" width="8%" />
        <ElMain>
          <RouterView />
        </ElMain>
        <ElAside v-if="status.type === 'preview'" width="8%" />
      </ElContainer>
    </ElMain>
    <ElFooter></ElFooter>
  </ElContainer>

  <div></div>
</template>

<style>
body {
  word-break: keep-all;
  scrollbar-width: none;
}

::-webkit-scrollbar {
  display: none;
}

.header {
  position: relative;
  height: 84px;
  background-image: radial-gradient(transparent 1px, v-bind(tpColor) 1px);
  background-size: v-bind(tpRadius) v-bind(tpRadius);
  backdrop-filter: saturate(50%) blur(v-bind(tpRadius));
  -webkit-backdrop-filter: saturate(50%) blur(v-bind(tpRadius));
  top: 0;
  left: 0;
  z-index: 16;
}

table,
th,
td {
  font-size: v-bind((fontSize - 2) + 'px') !important;
}

sub,
sup {
  font-size: v-bind((fontSize - 3) + 'px') !important;
}

@media (prefer-color-scheme: dark) {
  span,
  p,
  u,
  b,
  math,
  th,
  td,
  sub,
  sup {
    color: #ffffff !important;
  }
}
</style>

<style scoped>
.full-width {
  width: 100%;
}
</style>
