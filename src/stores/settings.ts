import { defineStore } from 'pinia'

export const useSettingsStore = defineStore({
  id: 'settings',
  state: () => ({
    defaults: {
      showQuote: true,
    },
    math: {
      collection: {
        collectionOfNumbersDisplayMode: 'mathbb' as 'mathbb' | 'bold',
        positiveNumbers: 'N^*' as 'N^*' | 'N_+',
        irrationalNumbers: '\\complement_{\\mathbb{Q}}\\mathbb{R}' as
          | '\\complement_{\\mathbb{Q}}\\mathbb{R}'
          | '\\mathbb{Q}^c',
      },
    },
    physics: {
      punctuation: {
        period: '．' as '。' | '．',
      },
    },
    chemistry: {
      units: {
        complex: 'mol/L' as 'mol/L' | 'mol\\cdot L^{-1}',
      },
      punctuation: {
        period: '．' as '。' | '．',
      },
    },
    politics: {
      judgeAnswerType: 'T/F' as 'T/F' | 'Y/N' | '√/×'
    }
  }),
  actions: {
    useQuote(quote: boolean) {
      this.defaults.showQuote = quote
    },
    useMathCollectionOfNumbersDisplayMode(type: 'mathbb' | 'bold') {
      this.math.collection.collectionOfNumbersDisplayMode = type
    },
    useMathPositiveNumbers(type: 'N^*' | 'N_+') {
      this.math.collection.positiveNumbers = type
    },
    useMathIrrationalNumbers(
      type: '\\complement_{\\mathbb{Q}}\\mathbb{R}' | '\\mathbb{Q}^c'
    ) {
      this.math.collection.irrationalNumbers = type
    },
    usePhysicsPeriod(type: '。' | '．') {
      this.physics.punctuation.period = type
    },
    useChemistryComplexUnit(type: 'mol/L' | 'mol\\cdot L^{-1}') {
      this.chemistry.units.complex = type
    },
    useChemistryPeriod(type: '。' | '．') {
      this.chemistry.punctuation.period = type
    },
    usePoliticsJudgeAnswerType(type: 'T/F' | 'Y/N' | '√/×') {
      this.politics.judgeAnswerType = type
    }
  },
  persist: {
    storage: window.localStorage,
    paths: [
      'defaults',
      'math.collection.collectionOfNumbersDisplayMode',
      'math.collection.positiveNumbers',
      'math.collection.irrationalNumbers',
      'physics.punctuation.period',
      'chemistry.units.complex',
      'chemistry.punctuation.period',
    ],
  },
})
