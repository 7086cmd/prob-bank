import { watch, type Ref } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import type { TextContent, Content } from '@/../@types/content'

/**
 * Composable for handling quote settings (（　　）) in problem content
 * Eliminates code duplication across problem type components
 */
export function useQuoteSettings(content: Ref<Content[]>) {
  const settings = useSettingsStore()

  function addQuoteIfNeeded() {
    if (!settings.defaults.showQuote) return

    const idx = content.value.findLastIndex((x) => x.type === 'text')
    if (idx === -1) return

    const textContent = content.value[idx]
    if (textContent.type === 'text') {
      const textItem = textContent as TextContent
      if (!textItem.content.endsWith('（　　）')) {
        textItem.content += '（　　）'
      }
    }
  }

  // Add quote on initialization
  addQuoteIfNeeded()

  // Watch for settings changes
  watch(
    () => settings.defaults.showQuote,
    () => {
      addQuoteIfNeeded()
    }
  )

  return {
    addQuoteIfNeeded,
  }
}
