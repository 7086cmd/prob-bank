<script setup lang="ts">
import PFormulaEdit from '@/components/content/PFormulaEdit.vue'
import { useSettingsStore } from '@/stores/settings'
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElOption,
  ElSwitch,
  ElCard,
} from 'element-plus'
import { ref, watch } from 'vue'

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
  <ElForm>
    <ElFormItem label="常规">
      <ElCard shadow="hover" class="card">
        <ElForm>
          <ElFormItem label="选择题">
            <ElCard shadow="hover" class="card">
              <ElForm>
                <ElFormItem label="括号">
                  <ElSwitch v-model="quote" />
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
