import { ipcRenderer, contextBridge } from 'electron'
import { ObjectId } from 'mongodb'

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
    ipcRenderer.send('baseWindowAction', action)
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
})
