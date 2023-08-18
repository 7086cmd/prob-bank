<script lang="ts" setup>
/* eslint-disable vue/valid-v-model */
import { useRoute } from 'vue-router'
import PDisplayProblemGroup from '@/components/problem-group/PDisplayProblemGroup.vue'

const route = useRoute()

const id = route.params.id as string
</script>

<template>
  <div>
    <PDisplayProblemGroup :_id="id" mode="page" :order="1" />
  </div>
</template>
