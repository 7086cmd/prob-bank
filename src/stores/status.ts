/**
 * 注明：使用 store 对于状态进行管理，如打印时、预览时等。
 */

import { defineStore } from 'pinia'

export const useStatusStore = defineStore('status', {
  state() {
    return {
      type: 'preview', // preview, print
      fontSize: 14, // 14
      answer: false, // 是否显示答案
      mode: 'normal',
      dispMode: 'student' as 'student' | 'teacher' | 'description' | 'answer',
      /**
       * （参考：学而思）
       * student: 仅显示题目
       * teacher: 显示题目和答案
       * description: 显示题目、答案和解析，如果解析为空则显示“解析待补充”
       * answer: 仅显示答案
       */
    }
  },
  actions: {
    usePrint() {
      this.type = 'print'
      this.fontSize = 14
    },
    usePreview() {
      this.type = 'preview'
      this.fontSize = 14
    },
    toggleAnswer() {
      this.answer = !this.answer
    },
    paperMode() {
      this.mode = 'paper'
    },
    useDisplayMode(mode: 'student' | 'teacher' | 'description' | 'answer') {
      this.dispMode = mode
      this.type = 'print'
      this.fontSize = 14
    },
    useDefaultMode() {
      this.dispMode = 'student'
      this.type = 'preview'
      this.fontSize = 14
    }
  },
})
