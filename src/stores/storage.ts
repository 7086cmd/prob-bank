import { defineStore } from 'pinia';

export const useStorageStore = defineStore({
  id: 'storage',
  state() {
    return {
      problems: [] as string[],
      papers: [] as string[],
    }
  },
  actions: {
    addProblem(id: string) {
      this.problems.push(id)
    },
    deleteProblem(id: string) {
      this.problems = this.problems.filter((item) => item !== id)
    },
    addPaper(id: string) {
      this.papers.push(id)
    },
    deletePaper(id: string) {
      this.papers = this.papers.filter((item) => item !== id)
    }
  }
})
