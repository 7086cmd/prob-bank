<script setup lang="ts">
import type { ArticleContent } from '@/../@types/content'
import { ElCard, ElCol, ElForm, ElFormItem, ElInput, ElOption, ElRow, ElSelect, ElSwitch } from 'element-plus'
import { reactive, ref, toRefs, watch } from 'vue'
import PArticle from './PArticle.vue'

const props = defineProps<{
  modelValue: string[]
  title: string
  author: string
  language: 'zh' | 'en'
  align: 'left' | 'center'
}>()

const emits = defineEmits([
  'update:modelValue',
  'update:title',
  'update:author',
  'update:language',
  'update:align',
])

const languageOptions = [
  {
    value: 'zh',
    label: '中文',
  },
  {
    value: 'en',
    label: '英文',
  },
]

const alignOptions = [
  {
    value: 'left',
    label: '一般文体',
  },
  {
    value: 'center',
    label: '诗歌',
  },
]

const { modelValue, title, author, language, align } = toRefs(props)

const ctn = ref(modelValue.value.join('\n'))
const tit = ref(title?.value)
const auth = ref(author.value)
const lang = ref(language.value)
const dir = ref(align.value)
const art = reactive<ArticleContent>({
  type: 'article',
  article: {
    title: tit.value,
    content: ctn.value.split('\n').map((x) => x.trim()) as string[],
    author: auth.value,
    language: language.value,
    align: align.value,
  },
})

watch(
  ctn,
  () => {
    emits(
      'update:modelValue',
      ctn.value.split('\n').map((x) => x.trim())
    )
    art.article.content = ctn.value.split('\n').map((x) => x.trim())
  },
  {
    immediate: true,
    deep: true,
  }
)

watch(
  lang,
  () => {
    emits('update:language', lang.value)
    art.article.language = lang.value
  },
  {
    immediate: true,
  }
)

watch(
  dir,
  () => {
    emits('update:align', dir.value)
    art.article.align = dir.value
  },
  {
    immediate: true,
  }
)

watch(
  tit,
  () => {
    emits('update:title', tit.value)
    art.article.title = tit.value
  },
  {
    immediate: true,
  }
)

watch(
  auth,
  () => {
    emits('update:author', auth.value)
    art.article.author = auth.value
  },
  {
    immediate: true,
  }
)

const preview = ref(false)
</script>

<template>
  <ElCard shadow="hover">
    <ElForm>
      <ElFormItem label="预览" class="py-2">
        <ElSwitch v-model="preview" />
        <ElCard shadow="hover" v-if="preview" style="width: 100%">
          <PArticle :article="art.article" />
        </ElCard>
      </ElFormItem>
      <ElFormItem label="标题" v-if="!preview" class="py-2">
        <ElInput v-model="tit" />
      </ElFormItem>
      <ElFormItem label="作者" v-if="!preview" class="py-2">
        <ElInput v-model="auth" />
      </ElFormItem>
      <ElFormItem label="内容" v-if="!preview" class="py-2">
        <ElInput v-model="ctn" type="textarea" autosize />
      </ElFormItem>
      <ElRow class="py-2" v-if="!preview">
        <ElCol :span="11">
          <ElFormItem label="语言">
            <ElSelect v-model="lang" style="width: 100%">
              <ElOption v-for="opt in languageOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :span="2" />
        <ElCol :span="11">
          <ElFormItem label="类型">
            <ElSelect v-model="dir" style="width: 100%">
              <ElOption v-for="opt in alignOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>
  </ElCard>
</template>
