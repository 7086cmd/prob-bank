<script setup lang="ts">
import type { Content } from '@/../@types/content'
import {
  Check,
  Close,
  Delete,
  Plus,
  SortUp,
  SortDown,
} from '@element-plus/icons-vue'
import {
  ElButton,
  ElButtonGroup,
  ElCard,
  ElCheckbox,
  ElCol,
  ElRadio,
  ElRow,
  ElSwitch,
} from 'element-plus'
import { toRefs, watch, ref } from 'vue'
import PContentEditor from '../content/PContentEditor.vue'

interface Option {
  id: number
  content: Content[]
}

const props = defineProps<{
  type: 'single' | 'multiple' | 'judge'
  options?: Option[]
  single?: number
  multiple?: number[]
  judge?: boolean
}>()

const emits = defineEmits([
  'update:options',
  'update:single',
  'update:multiple',
  'update:judge',
])

const {
  type,
  options: _options,
  single: _single,
  multiple: _multiple,
  judge: _judge,
} = toRefs(props)

const opts = ref<Option[]>(_options?.value ?? [])
const btns = ref<boolean[]>(
  type.value === 'judge'
    ? []
    : _options?.value?.map((_, idx) =>
        type.value === 'single'
          ? idx === _single?.value
          : _multiple?.value?.includes(idx) ?? false
      ) ?? []
)
const ansSingle = ref<number>(_single?.value ?? 0)
const ansMulti = ref<number[]>(_multiple?.value ?? [])
const ansJudge = ref<boolean>(_judge.value ?? false)

watch(
  () => opts.value,
  () => {
    emits('update:options', opts.value)
  },
  {
    immediate: true,
    deep: true,
  }
)

watch(
  ansSingle,
  () => {
    btns.value = opts.value.map((_, idx) => ansSingle.value === idx)
    emits('update:single', ansSingle.value)
  },
  {
    immediate: true,
    deep: true,
  }
)

watch(
  () => ansMulti.value,
  () => {
    btns.value = opts.value.map((_, idx) => ansMulti.value.includes(idx))
    emits('update:multiple', ansMulti.value)
  },
  {
    immediate: true,
    deep: true,
  }
)

watch(
  ansJudge,
  () => {
    emits('update:judge', ansJudge.value)
  },
  {
    immediate: true,
    deep: true,
  }
)

function handleCreateOption() {
  opts.value.push({
    id: opts.value.length,
    content: [
      {
        type: 'text',
        content: '',
      } as Content,
    ],
  })
  btns.value.push(false)
}

function handleDeleteOption(idx: number) {
  opts.value.splice(idx, 1)
  btns.value.splice(idx, 1)
  // if (type.value === 'single') {
  //   if (ansSingle.value === idx) {
  //     ansSingle.value = 0
  //   } else if (ansSingle.value > idx) {
  //     ansSingle.value--
  //   }
  // } else if (type.value === 'multiple') {
  //   if (ansMulti.value.includes(idx)) {
  //     ansMulti.value = ansMulti.value.filter((i) => i !== idx)
  //   } else {
  //     ansMulti.value = ansMulti.value.map((i) => (i > idx ? i - 1 : i))
  //   }
  // }
}
</script>

<template>
  <ElCard shadow="hover">
    <div v-if="type !== 'judge'">
      <div style="text-align: right">
        <ElButton
          text
          bg
          circle
          type="success"
          :icon="Plus"
          @click="handleCreateOption"
        ></ElButton>
      </div>
    </div>
    <ElSwitch
      v-if="type === 'judge'"
      v-model="ansJudge"
      :active-action-icon="Check"
      active-text="正确"
      :inactive-action-icon="Close"
      inactive-text="错误"
    />
    <div v-else>
      <div v-for="(option, idx) in opts" :key="option.toString()" class="py-2">
        <ElCard shadow="hover">
          <ElRow>
            <ElCol :span="2">
              <ElRadio
                v-if="type === 'single'"
                v-model="btns[idx]"
                :label="String.fromCharCode(idx + 65)"
                style="
                  position: relative;
                  top: 50%;
                  transform: translateY(-50%);
                "
                @change="btns[idx] ? (ansSingle = idx) : (ansSingle = -1)"
                border
              />
              <ElCheckbox
                v-else-if="type === 'multiple'"
                v-model="btns[idx]"
                :label="String.fromCharCode(idx + 65)"
                style="
                  position: relative;
                  top: 50%;
                  transform: translateY(-50%);
                "
                @change="
                  btns[idx]
                    ? ansMulti.push(idx)
                    : (ansMulti = ansMulti.filter((i) => i !== idx))
                "
                border
              />
            </ElCol>
            <ElCol :span="20">
              <PContentEditor v-model="option.content" />
            </ElCol>
            <ElCol :span="2">
              <div style="text-align: right">
                <ElButtonGroup>
                  <ElButton
                    text
                    bg
                    circle
                    :type="idx === 0 ? 'danger' : 'primary'"
                    :icon="SortUp"
                    size="small"
                  />
                  <ElButton
                    text
                    bg
                    circle
                    :type="idx === opts.length - 1 ? 'danger' : 'primary'"
                    :icon="SortDown"
                    size="small"
                  />
                </ElButtonGroup>
                <ElButton
                  text
                  bg
                  circle
                  type="danger"
                  :icon="Delete"
                  @click="handleDeleteOption(idx)"
                  style="position: absolute; right: 0; bottom: 0"
                />
              </div>
            </ElCol>
          </ElRow>
        </ElCard>
      </div>
    </div>
  </ElCard>
</template>
