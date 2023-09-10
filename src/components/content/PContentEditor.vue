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
  ArticleContent,
} from '@/../@types/content'
import {
  ElCard,
  ElCol,
  ElRow,
  ElButton,
  ElSpace,
  ElTooltip,
  ElDivider,
  ElButtonGroup,
} from 'element-plus'
import {
  Code,
  Text,
  Pic,
  InsertTable,
  Material,
  DividingLine,
  PreviewOpen,
  PreviewClose,
  DocDetail,
  ParagraphRectangle,
  // ListView
} from '@icon-park/vue-next'
import { toRefs, type Component, watch, ref } from 'vue'
import type { TableContent } from '@/../@types/content'
import { Delete, SortUp, SortDown } from '@element-plus/icons-vue'
import PParagraph from './PParagraph.vue'
import PImg from './PImg.vue'
import PMaterialEdit from './PMaterialEdit.vue'
import PContent from './PContent.vue'
import { transformTo, transformFrom } from './transformer'
import PArticleEdit from './PArticleEdit.vue'

const props = defineProps<{
  modelValue: Content[]
  disables?: (
    | 'table'
    | 'formula'
    | 'code'
    | 'material'
    | 'textarea'
    | 'image'
    | 'article'
    | 'problem'
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
    description:
      '最朴素的文字，使用 Markdown 的 renderInline，不支持标题等格式，添加空格支持。',
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
    description:
      '图片，支持上传图片，支持自动排版，如果长宽比大于 2.5 则居中，否则居右。最大为 20KiB。',
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
    description: '文科题目常见的“材料一”类材料，具有自动排版功能。',
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
    description: '代码，支持语言高亮。正在开发，计划加入 Monaco Editor。',
  },
  {
    name: '分割线',
    icon: DividingLine,
    base: {
      type: 'divider',
    } as DividerContent,
    type: 'info',
    description: '分割线，最朴素的分割线。',
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
    description:
      '表格，不是 Markdown 格式的表格，支持合并单元格等复杂操作，目前正在开发。',
  },
  {
    name: '段落',
    icon: ParagraphRectangle,
    base: {
      type: 'textarea',
      content: '',
    } as TextareaContent,
    type: 'warning',
    disabled: disables?.value?.includes('textarea'),
    description:
      '（Markdown 支持），支持 Markdown 基本语法，支持公式，暂不支持 PlantUML 和 Mermaid。',
  },
  {
    name: '文章',
    type: 'primary',
    icon: DocDetail,
    base: {
      type: 'article',
      article: {
        title: '',
        content: [],
        author: '',
        language: 'zh',
        align: 'left',
      },
    },
  },
] as Array<{
  name: string
  icon: Component
  base: Content
  disabled?: boolean
  type: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  description?: string
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
            <ElButtonGroup v-if="!preview">
              <ElTooltip
                v-for="(btn, idx) in contentTypes"
                :key="btn.name"
                :content="btn.name"
                effect="light"
                :placement="idx % 2 ? 'bottom' : 'top'"
              >
                <ElButton
                  v-if="!btn.disabled"
                  @click="contents.push(JSON.parse(JSON.stringify(btn.base)))"
                  :icon="btn.icon"
                  :type="btn.type"
                  text
                  bg
                  circle
                />
              </ElTooltip>
            </ElButtonGroup>
            <ElDivider direction="vertical" v-if="!preview" />
            <ElButton
              text
              bg
              circle
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
              circle
              bg
              type="danger"
              :icon="Delete"
              @click="deleteElement(idx)"
            />
            <ElDivider direction="vertical" />
            <ElButtonGroup>
              <ElButton
                text
                circle
                bg
                :type="idx === 0 ? 'danger' : 'primary'"
                :icon="SortUp"
              />
              <ElTooltip
                :content="
                  contentTypes.find((x) => x.base.type === content.type)
                    ?.description
                "
                effect="light"
                placement="top"
                trigger="click"
              >
                <ElButton
                  text
                  round
                  bg
                  :type="
                    contentTypes.find((x) => x.base.type === content.type)?.type
                  "
                  :icon="
                    contentTypes.find((x) => x.base.type === content.type)?.icon
                  "
                >
                  {{
                    contentTypes.find((x) => x.base.type === content.type)?.name
                  }}
                </ElButton>
              </ElTooltip>
              <ElButton
                text
                circle
                bg
                :type="idx === contents.length - 1 ? 'danger' : 'primary'"
                :icon="SortDown"
              />
            </ElButtonGroup>
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
            <PArticleEdit
              v-else-if="contents[idx].type === 'article'"
              v-model="(contents[idx] as ArticleContent).article.content"
              v-model:title="(contents[idx] as ArticleContent).article.title"
              v-model:author="
                (contents[idx] as ArticleContent).article.author
              "
              v-model:language="
                (contents[idx] as ArticleContent).article.language
              "
              v-model:align="(contents[idx] as ArticleContent).article.align"
            />
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
