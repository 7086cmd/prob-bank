<script setup lang="ts">
import POptionEdit from '@/components/problems/POptionEdit.vue';
import { ref } from 'vue'

const opts = ref([])
const answer = ref(0)
const answer2 = ref([])
const judge = ref(false)

setInterval(() => {
  console.log(opts.value, answer.value)
}, 2000)
</script>

<template>
  <POptionEdit v-model:options="opts" type="single" v-model:single="answer" />
</template>
