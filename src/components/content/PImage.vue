<script setup lang="ts">
/* global defineProps */
import { ref, toRefs } from 'vue'
import { ElImage, ElIcon, ElText } from 'element-plus'
import { Picture } from '@element-plus/icons-vue'

const props = defineProps<{
  src: string
  alt?: string
}>()

console.log(props)

const { src, alt } = toRefs(props)

const loading = ref(true)
const align = ref('right')

function useRatio() {
  const image = new Image()
  image.src = src.value
  image.onload = () => {
    if (image.width < 2.5 * image.height) {
      align.value = 'right'
    } else {
      align.value = 'center'
    }
  }
}

useRatio()
</script>

<template>
  <div :style="`text-align: ${align}`">
    <ElImage
      v-loading="loading"
      :style="{ userSelect: 'none' }"
      :src="src"
      :alt="alt"
      @load="loading = false"
      @contextmenu.prevent
    >
      <br />
      <template #error>
        <div style="text-align: center">
          <ElIcon><Picture /></ElIcon>
          <ElText style="color: C0C4CC; font-size: 6px; text-align: center">
            加载失败
          </ElText>
        </div>
      </template>
      <template #viewer>
        <div v-if="alt">
          <ElText style="color: C0C4CC; font-size: 6px; text-align: center">
            {{ alt }}
          </ElText>
        </div>
      </template>
      <br />
    </ElImage>
  </div>
</template>
