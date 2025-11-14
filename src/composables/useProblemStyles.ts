import { computed } from 'vue'
import { useStatusStore } from '@/stores/status'

/**
 * Shared styles composable for problem components
 * Eliminates CSS duplication across problem type components
 */
export function useProblemStyles() {
  const status = useStatusStore()

  const descriptionFontSize = computed(() => `${status.fontSize + 1}px`)
  const orderFontSize = computed(() => `${status.fontSize}px`)

  const descriptionStyle = computed(() => ({
    fontFamily: '方正仿宋',
    fontSize: descriptionFontSize.value,
  }))

  const orderStyle = computed(() => ({
    fontFamily: 'Ubuntu, Source Han Serif',
    fontSize: orderFontSize.value,
  }))

  return {
    fontSize: computed(() => status.fontSize),
    descriptionFontSize,
    orderFontSize,
    descriptionStyle,
    orderStyle,
  }
}
