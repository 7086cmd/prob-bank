<script setup lang="ts">
/*eslint-disable no-irregular-whitespace */
// @ts-nocheck
import { ref } from 'vue'
import { getGradeSubjectName } from '@/utils/subject'
import { ElDivider } from 'element-plus'
import { usePaperStore } from '@/stores/paper'
import PPaperElement from './PPaperElement.vue'
import { useStatusStore } from '@/stores/status'

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
        <ElDivider />
        <div v-if="loaded">
          <PPaperElement
            v-for="(element, idx) in paper.elements"
            :key="idx.toString()"
            :element="element"
            :index="idx"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>
