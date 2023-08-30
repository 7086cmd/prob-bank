<script setup lang="ts">
/* global defineProps, defineEmits */
import type {
  CodeContent,
  Content,
  ImageContent,
  MaterialContent,
  TextContent,
  TextareaContent,
  DividerContent,
} from '@/../@types/content'
import {
  ElCard,
  ElCol,
  ElRow,
  ElButton,
  ElSpace,
  ElTooltip,
  ElDivider,
} from 'element-plus'
import {
  Code,
  ParagraphAlphabet,
  Text,
  Inline,
  Pic,
  InsertTable,
  Material,
  DividingLine,
  PreviewOpen,
  PreviewClose,
} from '@icon-park/vue-next'
import { toRefs, type Component, watch, ref } from 'vue'
import type { TableContent } from '@/../@types/content'
import type { FormulaContent } from '@/../@types/content'
import { Delete } from '@element-plus/icons-vue'
import PParagraph from './PParagraph.vue'
import PImg from './PImg.vue'
import PMaterialEdit from './PMaterialEdit.vue'
import PContent from './PContent.vue'

function transformTo(ctn: Content[]) {
  // The General "Content" splits `text`, `formula` and `blank` content. So we need to transform it to the specific content.
  // Usual: Merge `text`, `formula`, and `blank`
  return ctn
    .map((content) => {
      if (content.type === 'formula') {
        return {
          type: 'text',
          content: `$${content.content}$`,
        } as TextContent
      } else if (content.type === 'blank') {
        return {
          type: 'text',
          content: `!blank([${content.answer
            .map((x) => {
              if (x.type === 'text') return x.content
              else if (x.type === 'formula') return `$${x.content}$`
              else return
            })
            .join('')}])`,
        } as TextContent
      } else return content
    })
    .reduce((base, elm) => {
      if (base.length === 0) {
        base.push(elm)
        return base
      } else {
        const last = base[base.length - 1]
        if (last.type === 'text' && elm.type === 'text') {
          last.content += elm.content
          return base
        } else {
          base.push(elm)
          return base
        }
      }
    }, [] as Content[])
}

function transformFrom(ctn: Content[]) {
  function transformText(ctn: TextContent) {
    return ctn.content
      .split('$')
      .filter((x) => x)
      .map((x, i) => ({
        type: i % 2 === 0 ? 'text' : 'formula',
        content: x,
      })) as Content[]
  }
  function transformBlank(ctn: TextContent) {
    if (!ctn.content.includes('!blank([')) return transformText(ctn)
    const blanks = ctn.content.split('!blank([')
    const result = blanks.reduce((prev, cur, ix) => {
      if (ix === 0) {
        prev.push(
          ...transformText({
            type: 'text',
            content: cur,
          })
        )
      } else {
        const answer = cur.split('])')[0]
        const text = cur.split('])').slice(1).join('])')
        prev.push({
          type: 'blank',
          answer: transformText({
            type: 'text',
            content: answer,
          }),
        })
        prev.push(
          ...transformText({
            type: 'text',
            content: text,
          })
        )
      }
      return prev
    }, [] as Content[])
    return result
  }
  return ctn.reduce((prev, cur) => {
    if (cur.type === 'text') {
      prev.push(...transformBlank(cur))
    } else {
      prev.push(cur)
    }
    return prev
  }, [] as Content[])
}

const props = defineProps<{
  modelValue: Content[]
  disables?: (
    | 'table'
    | 'formula'
    | 'code'
    | 'material'
    | 'textarea'
    | 'image'
  )[]
}>()

const { modelValue, disables } = toRefs(props)

const contentTypes = [
  {
    name: '文字',
    icon: Text,
    base: {
      type: 'text',
      content: '',
    } as TextContent,
    type: 'success',
  },
  {
    name: '图片',
    icon: Pic,
    base: {
      type: 'image',
      src: '',
      alt: '',
    } as ImageContent,
    type: 'primary',
  },
  {
    name: '段落',
    icon: ParagraphAlphabet,
    base: {
      type: 'textarea',
      content: '',
    } as TextareaContent,
    type: 'warning',
    disabled: disables?.value?.includes('textarea'),
  },
  {
    name: '材料',
    icon: Material,
    base: {
      type: 'material',
      material: {
        label: '',
        content: [],
        origin: '',
      },
    } as MaterialContent,
    type: 'danger',
    disabled: disables?.value?.includes('material'),
  },
  {
    name: '代码',
    icon: Code,
    base: {
      type: 'code',
      content: '',
      language: '',
    } as CodeContent,
    type: 'primary',
    disabled: disables?.value?.includes('code'),
  },
  {
    name: '分割线',
    icon: DividingLine,
    base: {
      type: 'divider',
    } as DividerContent,
    type: 'info',
  },
  {
    name: '公式',
    icon: Inline,
    base: {
      type: 'formula',
      content: '',
    } as FormulaContent,
    disabled: true,
    type: 'warning',
  },
  {
    name: '表格',
    icon: InsertTable,
    base: {
      type: 'table',
      content: [],
    } as TableContent,
    disabled: true,
    type: 'info',
  },
] as Array<{
  name: string
  icon: Component
  base: Content
  disabled?: boolean
  type: 'primary' | 'success' | 'warning' | 'danger' | 'info'
}>

const contents = ref(transformTo(modelValue.value))

const contentUnTransformed = ref(modelValue.value)

const emits = defineEmits(['update:modelValue'])

function deleteElement(idx: number) {
  contents.value.splice(idx, 1)
}

watch(
  () => contents.value,
  () => {
    emits('update:modelValue', transformFrom(contents.value))
    contentUnTransformed.value = transformFrom(contents.value)
  },
  {
    immediate: true,
    deep: true,
  }
)

const preview = ref(false)
</script>

<template>
  <ElCard shadow="hover" class="content-editor">
    <div class="p-2">
      <ElRow>
        <ElCol :span="8">
          <p class="text-m">内容编辑</p>
        </ElCol>
        <ElCol :span="16" style="text-align: right">
          <ElSpace>
            <ElSpace v-if="!preview">
              <ElTooltip
                v-for="(btn, idx) in contentTypes"
                :key="btn.name"
                :content="btn.name"
                effect="light"
                :placement="idx % 2 ? 'bottom' : 'top'"
              >
                <ElButton
                  :disabled="btn.disabled"
                  @click="contents.push(JSON.parse(JSON.stringify(btn.base)))"
                  :icon="btn.icon"
                  :type="btn.type"
                  text
                  bg
                  circle
                  size="small"
                />
              </ElTooltip>
            </ElSpace>
            <ElDivider v-if="!preview" direction="vertical" />
            <ElButton
              text
              bg
              circle
              size="small"
              :type="preview ? 'success' : 'danger'"
              :icon="preview ? PreviewClose : PreviewOpen"
              @click="preview = !preview"
            />
          </ElSpace>
        </ElCol>
      </ElRow>
      <ElDivider />
      <div
        class="py-2"
        v-for="(content, idx) in contents"
        :key="idx + Math.random().toString(36)"
      >
        <ElCard shadow="hover" v-if="!preview">
          <ElSpace>
            <ElButton
              text
              bg
              circle
              type="danger"
              :icon="Delete"
              @click="deleteElement(idx)"
            />
            <ElButton
              text
              round
              :type="
                contentTypes.find((x) => x.base.type === content.type)?.type
              "
              :icon="
                contentTypes.find((x) => x.base.type === content.type)?.icon
              "
            >
              {{ contentTypes.find((x) => x.base.type === content.type)?.name }}
            </ElButton>
          </ElSpace>
          <div class="py-1">
            <PParagraph
              v-if="contents[idx].type === 'text'"
              v-model="(contents[idx] as TextContent).content"
              mode="line"
            />
            <PImg
              v-else-if="contents[idx].type === 'image'"
              v-model="(contents[idx] as ImageContent).src"
            />
            <PParagraph
              v-if="contents[idx].type === 'textarea'"
              v-model="(contents[idx] as TextareaContent).content"
              mode="area"
            />
            <PMaterialEdit
              v-else-if="contents[idx].type === 'material'"
              v-model="(contents[idx] as MaterialContent).material.content"
              v-model:label="(contents[idx] as MaterialContent).material.label"
              v-model:origin="
                (contents[idx] as MaterialContent).material.origin
              "
            />
            <ElDivider v-else-if="contents[idx].type === 'divider'">
              这一条礼节性的分割线，在正式场合不会显示这一段文字
            </ElDivider>
          </div>
        </ElCard>
      </div>
      <ElCard shadow="hover" v-if="preview">
        <PContent :content="contentUnTransformed" />
      </ElCard>
    </div>
  </ElCard>
</template>

<style scoped>
.content-editor {
  width: 100%;
}
</style>
