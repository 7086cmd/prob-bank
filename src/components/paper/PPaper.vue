<script setup lang="ts">
/*eslint-disable no-irregular-whitespace */
import { ref } from 'vue'
import { getGradeSubjectName } from '@/utils/subject'
import { usePaperStore } from '@/stores/paper'
import PPaperElement from './PPaperElement.vue'
import { useStatusStore } from '@/stores/status'
import type { Content } from '@/../@types/content'
import { classifyAnwersByType, getAnswerInPaper } from './answer'
import PContent from '../content/PContent.vue'

const paper = usePaperStore()
const status = useStatusStore()

const ordlist = ref<
  {
    _id: string
    type: 'problem' | 'problem-group'
    ord: number
  }[]
>([])

const loaded = ref(false)

const answer = ref<Content[]>([])

getAnswerInPaper(paper.elements).then((resp) => {
  answer.value = classifyAnwersByType(resp)
})

paper.getAllElementsId().then((resp) => {
  ordlist.value = resp
  loaded.value = true
})

paper.$subscribe(() => {
  loaded.value = false
  paper.getAllElementsId().then((resp) => {
    ordlist.value = resp
    loaded.value = true
  })
})

paper.sortItem('type')
</script>

<template>
  <div>
    <Transition enter-active-class="animate__animated animate__fadeIn">
      <div class="meta">
        <p class="text-2xl py-2 origin" style="text-align: center">
          {{ paper.metadata.name }}
        </p>
        <p
          v-if="status.type === 'preview' || status.dispMode !== 'student'"
          class="text-m origin"
          style="text-align: right"
        >
          {{
            getGradeSubjectName(paper.metadata.level, paper.metadata.subject)
          }}试卷编号：{{ paper._id }}
        </p>
        <div v-if="loaded">
          <div v-if="status.dispMode !== 'answer'">
            <PPaperElement
              v-for="(element, idx) in paper.elements"
              :key="idx.toString()"
              :element="element"
              :index="idx"
            />
          </div>
          <div v-else>
            <PContent :content="answer" />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
@import '@/assets/font.css';
</style>
