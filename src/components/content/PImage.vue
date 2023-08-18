<script setup lang="ts">
/* global defineProps */
import { ref, toRefs } from 'vue'

const props = defineProps<{
  src: string
  alt?: string
}>()

const { src, alt } = toRefs(props)

const loading = ref(true)
const align = ref('right')

function useRatio() {
  const image = new Image()
  image.src = src.value
  image.onload = () => {
    loading.value = false
    if (image.width < 2.5 * image.height) {
      align.value = 'right'
    } else {
      align.value = 'right'
    }
  }
}

useRatio()
</script>

<template>
  <div class="py-2" :style="`text-align: right`">
    <p :style="`text-align: right; display: block`">
      <br />
      <img :src="src" :alt="alt" />
      <br />
    </p>
  </div>
</template>

<style scoped>
img {
  display: block !important;
  margin-right: 2rem !important;
  margin-left: auto !important;
  right: 2rem !important;
  flex: auto;
}
</style>
