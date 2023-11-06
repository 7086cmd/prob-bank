<script setup lang="ts">
import PFormulaEdit from '@/components/content/PFormulaEdit.vue'
import { useSettingsStore } from '@/stores/settings'
import { useStatusStore } from '@/stores/status'
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElOption,
  ElSwitch,
  ElCard,
} from 'element-plus'
import { ref, watch, reactive } from 'vue'

const status = useStatusStore()

const fonts = ref<
  {
    label: string
    value: string
  }[]
>([])
const fetched = ref(false)

const fonting = reactive({
  preview: {
    family: status.fontSet.displayFontFamily,
    size: status.fontSet.displayFontSize,
  },
  print: {
    family: status.fontSet.printFontFamily,
    size: status.fontSet.printFontSize,
  },
})

watch(
  fonting,
  () => {
    status.fontSet.displayFontFamily = fonting.preview.family
    status.fontSet.displayFontSize = fonting.preview.size
    status.fontSet.printFontFamily = fonting.print.family
    status.fontSet.printFontSize = fonting.print.size
  },
  {
    deep: true,
    immediate: true,
  }
)

window.probbank.getFonts({ disableQuoting: true }).then((res) => {
  fonts.value = res.map((x) => ({
    label: x,
    value: x,
  }))
  fetched.value = true
})

const settings = useSettingsStore()

const quote = ref(settings.defaults.showQuote)

watch(quote, () => {
  settings.defaults.showQuote = quote.value
})

const numberCollectionType = ref(
  settings.math.collection.collectionOfNumbersDisplayMode === 'mathbb'
)

watch(numberCollectionType, () => {
  settings.math.collection.collectionOfNumbersDisplayMode =
    numberCollectionType.value ? 'mathbb' : 'bold'
})

const irrationalType = ref(
  settings.math.collection.irrationalNumbers === '\\mathbb{Q}^c'
)

watch(irrationalType, () => {
  settings.math.collection.irrationalNumbers = irrationalType.value
    ? '\\mathbb{Q}^c'
    : '\\complement_{\\mathbb{Q}}\\mathbb{R}'
})

const physicsDotPeriod = ref(settings.physics.punctuation.period === '．')

watch(physicsDotPeriod, () => {
  settings.physics.punctuation.period = physicsDotPeriod.value ? '．' : '。'
})

const chemistryDotPeriod = ref(settings.chemistry.punctuation.period === '．')

watch(chemistryDotPeriod, () => {
  settings.chemistry.punctuation.period = chemistryDotPeriod.value ? '．' : '。'
})
</script>

<template>
  <p class="text-2xl py-4">设置</p>
  <ElForm v-loading="!fetched">
    <ElFormItem label="常规">
      <ElCard shadow="hover" class="card">
        <ElForm>
          <ElFormItem label="选择" class="py-2">
            <ElCard shadow="hover" class="card">
              <ElForm>
                <ElFormItem label="括号">
                  <ElSwitch v-model="quote" />
                </ElFormItem>
              </ElForm>
            </ElCard>
          </ElFormItem>
          <ElFormItem label="字体" class="py-2">
            <ElCard shadow="hover" class="card">
              <ElForm>
                <ElFormItem label="预览字体" class="py-2">
                  <ElSelect
                    filterable
                    v-model="fonting.preview.family"
                    style="width: 100%"
                  >
                    <ElOption
                      v-for="font in fonts"
                      :key="font.value"
                      :value="font.value"
                    >
                      <span :style="{ fontFamily: font.value }">
                        {{ font.label }}
                      </span>
                    </ElOption>
                  </ElSelect>
                </ElFormItem>
                <ElFormItem label="字体大小" class="py-2">
                  <ElInput v-model.number="fonting.preview.size" />
                </ElFormItem>
                <ElFormItem label="打印字体" class="py-2">
                  <ElSelect
                    filterable
                    v-model="fonting.print.family"
                    style="width: 100%"
                  >
                    <ElOption
                      v-for="font in fonts"
                      :key="font.value"
                      :value="font.value"
                    >
                      <span :style="{ fontFamily: font.value }">
                        {{ font.label }}
                      </span>
                    </ElOption>
                  </ElSelect>
                </ElFormItem>
                <ElFormItem label="字体大小" class="py-2">
                  <ElInput v-model.number="fonting.print.size" />
                </ElFormItem>
              </ElForm>
            </ElCard>
          </ElFormItem>
        </ElForm>
      </ElCard>
    </ElFormItem>
    <ElFormItem label="数学">
      <ElCard shadow="hover" class="card">
        <ElForm>
          <ElFormItem label="集合">
            <ElCard shadow="hover" class="card">
              <ElForm>
                <ElFormItem label="数集样式">
                  <PFormulaEdit
                    model-value="\bold{R}"
                    :editable="false"
                    :display="1"
                  /><ElSwitch v-model="numberCollectionType" /><PFormulaEdit
                    model-value="\mathbb{R}"
                    :editable="false"
                    :display="1"
                  />
                </ElFormItem>
                <ElFormItem label="无理数集">
                  <PFormulaEdit
                    model-value="\mathbb{Q}^c"
                    :editable="false"
                    :display="2"
                  /><ElSwitch v-model="irrationalType" /><PFormulaEdit
                    model-value="\complement_\mathbb{R}\mathbb{Q}"
                    :editable="false"
                    :display="2"
                  />
                </ElFormItem>
              </ElForm>
            </ElCard>
          </ElFormItem>
        </ElForm>
      </ElCard>
    </ElFormItem>
  </ElForm>
</template>

<style scoped>
.card {
  width: 100%;
}
</style>
