<script lang="ts" setup>
/* eslint-disable vue/valid-v-model */
import { useRoute } from 'vue-router'
import PDisplayProblem from '@/components/problems/PDisplayProblem.vue'
import { ref } from 'vue'

const route = useRoute()

const id = ref(route.params.id as string)
</script>

<template>
  <div>
    <PDisplayProblem :_id="id" mode="page" :order="1" />
  </div>
</template>
