// @ts-nocheck
import { defineStore } from 'pinia'
import type {
  Element,
  Paper,
  ProblemElement,
  ProblemElementSave,
  ProblemGroupElement,
  ProblemGroupElementSave,
} from '@/../@types/paper'
import type { ProblemGroup } from '@/../@types/problem-group'
import dayjs from 'dayjs'
import type { AllProblem } from '@/../@types/problem'
import { getProblem, getProblemGroup } from '@/api'

export const usePaperStore = defineStore('paper', {
  state() {
    return {
      _id: '',
      metadata: {
        level: ['S', 1],
        subject: 'Math',
        name: '试卷名称',
      },
      elements: [],
    } as Paper
  },
  actions: {
    async getElementOrd(key: number) {
      let base = 0
      let end = false
      this.elements.forEach(async (item, idx) => {
        if (!end)
          switch (item.type) {
            case 'problem-index': {
              base += 1
              break
            }
            case 'problem-group-index': {
              const result = await window.probbank.request({
                pathname: 'problem-group',
                method: 'get',
                request: {
                  params: {
                    _id: item._id,
                  },
                },
              })
              if (result.status === 'success') {
                const group = result.data as ProblemGroup
                base += group.problems.length
              }
              break
            }
            case 'problem': {
              base += 1
              break
            }
            case 'problem-group': {
              const group = item.content.problems
              base += group.length
              break
            }
            default:
              break
          }
        if (idx === key) end = true
      })
      return base
    },
    async getAllElementsId() {
      const base = [] as {
        type: 'problem' | 'problem-group'
        _id: string
        ord: number
      }[]
      this.elements.forEach(async (item, idx) => {
        if (
          item.type === 'problem-index' ||
          item.type === 'problem-group-index'
        ) {
          base.push({
            type: (item as ProblemGroupElement).type.replace('-index', '') as
              | 'problem'
              | 'problem-group',
            _id: (item as ProblemElement)._id,
            ord: await this.getElementOrd(idx),
          })
        } else if (item.type === 'problem' || item.type === 'problem-group') {
          base.push({
            type: (item as ProblemGroupElementSave).type,
            _id: (item as ProblemElementSave).content._id,
            ord: await this.getElementOrd(idx),
          })
        }
      })
      return base
    },
    push(element: Element) {
      this.elements.push(element)
    },
    splice(key: number) {
      this.elements.splice(key, 1)
    },
    async save(mode: 'complete' | 'index') {
      const res = {
        _id: this._id,
        metadata: this.metadata,
        elements: [] as Element[],
      }
      const getItem = async (idx: number = 0) => {
        const item = this.elements[idx]
        if (item.type === 'problem-index') {
          const resp = await getProblem(item._id)
          if (resp.status === 'success') {
            res.elements.push({
              type: 'problem',
              content: resp.data as AllProblem,
              _id: resp.data._id,
            })
          }
        } else if (item.type === 'problem-group-index') {
          const resp = await getProblemGroup(item._id)
          if (resp.status === 'success') {
            res.elements.push({
              type: 'problem-group',
              content: resp.data as ProblemGroup,
              _id: resp.data._id,
            })
          }
        } else {
          res.elements.push(item)
        }
        if (idx + 1 < this.elements.length) await getItem(idx + 1)
      }
      getItem().then(() => {
        const blob = new Blob(
          [
            JSON.stringify(
              mode === 'complete'
                ? res
                : {
                    _id: this._id,
                    metadata: this.metadata,
                    elements: this.elements,
                  }
            ),
          ],
          {
            type: 'application/json',
          }
        )
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Problem Bank Export Paper - ${
          this.metadata.name
        } - ${dayjs().format('YYYY-MM-DD HH:mm:ss')} - ${mode}.pbpaper`
        a.click()
        URL.revokeObjectURL(url)
      })
    },
    async switch(file: File) {
      // Step 1 - Save current paper
      if (this._id !== '') await this.save('index')
      // Step 2 - Load new paper
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = async () => {
        const res = JSON.parse(reader.result as string) as Paper
        this._id = res._id
        this.metadata = res.metadata
        this.elements = res.elements
      }
    },
    async create(metadata: Paper['metadata']) {
      if (this._id !== '') await this.save('index')
      this._id = ''
      this.metadata = metadata
      this.elements = []
    },
    async reset() {
      this.save('index').then(() => {
        this._id = ''
        ;(this.metadata = {
          level: ['S', 1],
          subject: '',
          name: '',
        }),
          (this.elements = [])
      })
    },
    ascend(type: 'problem' | 'problem-group', id: string) {
      const idx = this.elements.findIndex(
        (item) => item.type === type && item.content._id === id
      )
      if (idx === 0) return
      const tmp = this.elements[idx - 1]
      this.elements[idx - 1] = this.elements[idx]
      this.elements[idx] = tmp
    },
    descend(type: 'problem' | 'problem-group', id: string) {
      const idx = this.elements.findIndex(
        (item) => item.type === type && item.content._id === id
      )
      if (idx === this.elements.length - 1) return
      const tmp = this.elements[idx + 1]
      this.elements[idx + 1] = this.elements[idx]
      this.elements[idx] = tmp
    },
    setMetadata(metadata: Paper['metadata']) {
      this.metadata.level = metadata.level
      this.metadata.subject = metadata.subject
      this.metadata.name = metadata.name
    },
    useMetadata() {
      return this.metadata
    },
    setId(id: string) {
      if (this._id !== '') return
      this._id = id
    },
    useId() {
      return this._id
    },
    async refresh(type: 'problem' | 'problem-group', id: string) {
      if (!this.existsItem(type, id)) return
      const resp =
        type === 'problem' ? await getProblem(id) : await getProblemGroup(id)
      this.elements.map((item) => {
        if (item.type === type && item._id === id) {
          item.content = resp as AllProblem | ProblemGroup
        }
      })
    },
    async setItem(type: 'problem' | 'problem-group', id: string) {
      console.log(type, id, '114514')
      if (this.existsItem(type, id)) return
      const resp =
        type === 'problem' ? await getProblem(id) : await getProblemGroup(id)
      console.log(resp)
      if (type === 'problem') {
        this.elements.push({
          type: 'problem',
          content: resp as AllProblem,
          _id: (resp as AllProblem)._id,
        } as ProblemElementSave)
      } else if (type === 'problem-group') {
        this.elements.push({
          type: 'problem-group',
          content: resp as ProblemGroup,
          _id: (resp as ProblemGroup)._id,
        } as ProblemGroupElementSave)
      }
    },
    removeItem(type: 'problem' | 'problem-group', id: string) {
      const idx = this.elements.findIndex(
        (item) => item.type === type && item.content._id === id
      )
      this.elements.splice(idx, 1)
    },
    existsItem(type: 'problem' | 'problem-group', id: string) {
      return (
        this.elements.findIndex(
          (item) => item.type === type && item.content._id === id
        ) !== -1
      )
    },
    async getOrderItem(
      type:
        | 'problem'
        | 'problem-group'
        | 'problem-index'
        | 'problem-group-index',
      id: string
    ) {
      const idx = this.elements.findIndex((item) => {
        if (type === 'problem-index' || type === 'problem-group-index') {
          return item.type === type && item._id === id
        } else {
          return item.type === type && item.content._id === id
        }
      })
      return await this.getElementOrd(idx)
    },
    sortItem(method: 'time-asc' | 'time-dsc' | 'type') {
      const ords = {
        judge: 0,
        'single-choice': 1,
        'multiple-choice': 2,
        blank: 3,
        answer: 4,
      }
      if (method === 'type') {
        this.elements.sort((a, b) => {
          if (a.type === 'problem-index' || a.type === 'problem-group-index') {
            return 1
          } else if (
            b.type === 'problem-index' ||
            b.type === 'problem-group-index'
          ) {
            return -1
          } else if (a.type.includes('problem') && b.type.includes('problem')) {
            return ords[a.content.type] - ords[b.content.type]
          } else {
            return 1
          }
        })
      } else if (method === 'time-asc') {
        this.elements.sort((a, b) => {
          if (a.type === 'problem-index' || a.type === 'problem-group-index') {
            return 1
          } else if (
            b.type === 'problem-index' ||
            b.type === 'problem-group-index'
          ) {
            return -1
          } else if (a.type.includes('problem') && b.type.includes('problem')) {
            return dayjs(a.content.createdAt).isBefore(b.content.createdAt)
              ? -1
              : 1
          } else {
            return 1
          }
        })
      } else if (method === 'time-dsc') {
        this.elements.sort((a, b) => {
          if (a.type === 'problem-index' || a.type === 'problem-group-index') {
            return 1
          } else if (
            b.type === 'problem-index' ||
            b.type === 'problem-group-index'
          ) {
            return -1
          } else if (a.type.includes('problem') && b.type.includes('problem')) {
            return dayjs(a.content.createdAt).isBefore(b.content.createdAt)
              ? 1
              : -1
          } else {
            return 1
          }
        })
      }
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: window.localStorage,
        paths: ['_id', 'metadata', 'elements'],
      },
    ],
  },
})
