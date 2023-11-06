/**
 * 注明：使用 store 对于状态进行管理，如打印时、预览时等。
 */

import { defineStore } from 'pinia'

export const useStatusStore = defineStore('status', {
  state() {
    return {
      type: 'preview', // preview, print
      fontSize: 14, // 10
      answer: false, // 是否显示答案
      wrong: false, // 是否在打印时显示错题信息
      mode: 'normal',
      dispMode: 'student' as
        | 'student'
        | 'teacher'
        | 'description'
        | 'answer'
        | 'wrong',
      /**
       * （参考：学而思）
       * student: 仅显示题目
       * teacher: 显示题目和答案
       * description: 显示题目、答案和解析，如果解析为空则显示“解析待补充”
       * answer: 仅显示答案
       */
      fontSet: {
        displayFontSize: 14,
        displayFontFamily: '',
        printFontSize: 10,
        printFontFamily: '',
      },
    }
  },
  actions: {
    usePrint() {
      this.type = 'print'
      this.fontSize = this.fontSet.printFontSize
    },
    usePreview() {
      this.type = 'preview'
      this.fontSize = this.fontSet.displayFontSize
    },
    toggleAnswer() {
      this.answer = !this.answer
    },
    paperMode() {
      this.mode = 'paper'
    },
    useDisplayMode(
      mode: 'student' | 'teacher' | 'description' | 'answer' | 'wrong',
      withWrong: boolean = false
    ) {
      this.dispMode = mode
      this.type = 'print'
      this.fontSize = this.fontSet.printFontSize
      this.wrong = withWrong
    },
    useDefaultMode() {
      this.dispMode = 'student'
      this.type = 'preview'
      this.fontSize = this.fontSet.displayFontSize
    },
    getFontSet() {
      return this.fontSet
    },
    setFontSet(fontSet: {
      displayFontSize: number
      displayFontFamily: string
      printFontSize: number
      printFontFamily: string
    }) {
      this.fontSet = fontSet
    },
  },
})
