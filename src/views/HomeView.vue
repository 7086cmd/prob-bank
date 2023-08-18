<script setup lang="ts">
import { ElButton, ElDivider } from 'element-plus';
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <main>
    <p class="text-4xl py-12 align-center" style="text-align: center">
      Problem Bank
    </p>
    <ElDivider />
    <ElButton text bg class="full-width py-6" @click="router.push('/beta-test')">新功能实验</ElButton>
    <ElDivider />
    <p>
      <span class="text-2xl pb-2">Supported Functions:</span>
      <ol class="pl-4">
        <li class="text-xl">
          Problem (Display, Insert, Modify, Print, Download)
          <br /><br />
          <ElButton class="full-width py-4" text bg type="success" @click="router.push('/problem')">Click Here to Problem Index Page</ElButton>
          <br /><br />
        </li>
        <li class="text-xl">Problem Group (Display, Insert, Modify, Print, Download)
          <br /><br />
          <ElButton class="full-width py-4" text bg type="success" @click="router.push('/problem-group')">Click Here to Problem Index Page</ElButton>
          <br /><br />
        </li>
      </ol>
    </p>
  </main>
</template>

<style scoped>
.full-width {
  width: 100%;
}
</style>
