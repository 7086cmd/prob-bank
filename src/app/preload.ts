import { ipcRenderer, contextBridge } from 'electron'
import MarkdownIt from 'markdown-it'
import { ObjectId } from 'mongodb'
import katex_plug from './katex'
import katex from 'katex'
import * as sub from 'markdown-it-sub'
import * as sup from 'markdown-it-sup'
import * as mark from 'markdown-it-mark'
import 'katex/contrib/mhchem/mhchem.js'
import type { IOptions, FontList } from 'font-list'

contextBridge.exposeInMainWorld('probbank', {
  request(request: {
    pathname: string
    method: string
    request: { body: Record<string, unknown>; params: Record<string, string> }
  }) {
    return new Promise((resolve) => {
      ipcRenderer.send('request', request)
      ipcRenderer.once('response', (_, response) => {
        resolve(response)
      })
    })
  },
  actionBaseWindow: (
    action: 'close' | 'minimize' | 'maximize' | 'fullscreen'
  ) => {
    if (action === 'close') {
      ipcRenderer.send('closeBaseWindow')
    } else if (action === 'minimize') {
      ipcRenderer.send('minimizeBaseWindow')
    } else if (action === 'maximize') {
      ipcRenderer.send('maximizeBaseWindow')
    } else if (action === 'fullscreen') {
      ipcRenderer.send('fullscreenBaseWindow')
    }
  },
  os: process.platform,
  arch: process.arch,
  validObjectId(id: string) {
    return ObjectId.isValid(id)
  },
  inElectron: true,
  print(
    name: string,
    version: 'student' | 'answer' | 'description' | 'teacher',
    cb: (status: string, step: string) => void
  ) {
    ipcRenderer.send('print', {
      metadata: {
        name,
      },
      version,
    })
    ipcRenderer.on('print', (event, { status, message }) => {
      cb(status, message)
    })
  },
  on: ipcRenderer.on.bind(ipcRenderer),
  send: ipcRenderer.send.bind(ipcRenderer),
  renderMarkdown(mode: 'inline' | 'block', markdown: string) {
    const markdownIt = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
    })
      .use(sub)
      .use(sup)
      .use(mark)
    if (mode === 'inline') {
      return markdownIt.renderInline(markdown)
    } else {
      return markdownIt.use(katex_plug).render(markdown)
    }
  },
  renderKatex(math: string) {
    return katex.renderToString(math, {
      displayMode: false,
      throwOnError: false,
      errorColor: '#cc0000',
    })
  },
  getFonts(options: IOptions) {
    return new Promise<FontList>((resolve) => {
      ipcRenderer.send('getFonts', options)
      ipcRenderer.once('getFonts', (_, fonts) => {
        resolve(fonts)
      })
    })
  },
})
