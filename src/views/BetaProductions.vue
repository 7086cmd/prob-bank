<script setup lang="ts">
import PTextEdit from '@/components/content/PTextEdit.vue'
import PFormulaEdit from '@/components/content/PFormulaEdit.vue'
import { ref } from 'vue'
const text = ref('114514')
const formula = ref('\\dfrac{114514}{1919810}')
</script>

<template>
  <PTextEdit v-model="text" editable />
  <PFormulaEdit v-model="formula" editable />
</template>
