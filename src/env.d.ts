import { Result } from '@/app/api/env'
import { IOptions, FontList } from 'font-list'

export interface ProbBankActions {
  request: (request: {
    pathname: string
    method: string
    request?: { body?: Object; params?: Record<string, string> }
  }) => Promise<Result>
  actionBaseWindow: (
    action: 'close' | 'minimize' | 'maximize' | 'fullscreen'
  ) => void
  os: NodeJS.Platform
  arch: string
  validObjectId(id: string): boolean
  inElectron: boolean
  print: (
    name: string,
    version: 'student' | 'answer' | 'description' | 'teacher',
    cb: (status: string, step: string) => void
  ) => void,
  on: <T>(channel: string, listener: (...args: any[]) => void) => T
  invoke: <T>(channel: string, ...args: any[]) => Promise<T>
  send: <T>(channel: string, ...args: any[]) => T
  renderMarkdown: (mode: 'inline' | 'block', markdown: string) => string
  renderKatex: (math: string) => string,
  getFonts: (options?: IOptions) => Promise<FontList>
}

declare global {
  interface Window {
    probbank: ProbBankActions
  }
}
