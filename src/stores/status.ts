/**
 * 注明：使用 store 对于状态进行管理，如打印时、预览时等。
 */

import { defineStore } from 'pinia'

export const useStatusStore = defineStore({
  id: 'status',
  state() {
    return {
      type: 'preview', // preview, print
      fontSize: 14, // 12
      answer: true // 是否显示答案
    }
  },
  actions: {
    usePrint() {
      this.type = 'print'
      this.fontSize = 12
    },
    usePreview() {
      this.type = 'preview'
      this.fontSize = 14
    },
    toggleAnswer() {
      this.answer = !this.answer
    }
  }
})
