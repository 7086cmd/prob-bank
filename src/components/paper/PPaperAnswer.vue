<script lang="ts" setup>
import { usePaperStore } from '@/stores/paper'
import { getAnswerInPaper, classifyAnwersByType } from './answer'
import { ref } from 'vue'
import type { Content } from '@/../@types/content'
import PContent from '../content/PContent.vue'

const paper = usePaperStore()

const done = ref(false)

const answer = ref<Content[]>([])

getAnswerInPaper(paper.elements).then((resp) => {
    answer.value = classifyAnwersByType(resp)
    done.value = true
})
</script>

<template>
  <PContent
    answer
    class="fonts"
    v-if="done"
    :content="answer"
    :editable="false"
  />
</template>

<style>
.fonts {
  font-family: 'Ubuntu', 'Source Han Sans' !important;
}

@media print {
  .fonts {
    font-family: 'Ubuntu', 'Source Han Serif' !important;
  }
}
</style>
