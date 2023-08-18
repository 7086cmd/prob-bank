import { defineStore } from 'pinia'

export const useSettingsStore = defineStore({
  id: 'settings',
  state: () => ({
    serverUrl: '',
    fontSizePreview: 14,
    fontSizePrint: 11,
    preferredDownloadMode: 'document',
    
  }),
  actions: {
  },
})
