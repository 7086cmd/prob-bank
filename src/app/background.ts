import {
  app,
  BrowserWindow,
  screen,
  ipcMain,
  dialog,
  shell,
  protocol,
  net,
} from 'electron'
import { resolve, join } from 'path'
import { MongoClient, ObjectId } from 'mongodb'
import { existsSync, writeFileSync } from 'fs'
import { pathToFileURL } from 'url'
import Koa from 'koa'
import KoaRouter from '@koa/router'
import { bodyParser as KoaBodyparser } from '@koa/bodyparser'
import KoaCors from '@koa/cors'
import {
  getProblem,
  modifyProblem,
  deleteProblem,
  getProblems,
} from './apis/problem'
import type { AllProblem } from '@/../@types/problem'
import { log } from './log'
import {
  modifyProblemGroup,
  deleteProblemGroup,
  getProblemGroup,
} from './apis/problem-group'
import type { ProblemGroup } from '@/../@types/problem-group'
import { getFonts } from 'font-list'

const appServer = new Koa()
const router = new KoaRouter()

appServer.use(KoaCors({ origin: '*' }))
appServer.use(KoaBodyparser())

router.get('/api/v1/problem', async (ctx) => {
  try {
    const result = await getProblems()
    ctx.response.body = {
      status: 'success',
      code: 200,
      data: result,
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      code: 500,
      message: (e as Error).message,
    }
  }
})

router.get('/api/v1/problem/:_id', async (ctx) => {
  try {
    if (!ObjectId.isValid(ctx.params._id)) {
      ctx.response.body = {
        status: 'error',
        code: 400,
        message: 'Invalid _id',
      }
      return
    }
    const _id = ctx.params._id
    const result = await getProblem(_id as string)
    if (!result) {
      ctx.response.body = {
        status: 'error',
        code: 404,
        message: 'Problem not found!',
      }
      return
    } else {
      ctx.response.body = {
        status: 'success',
        code: 200,
        data: result,
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      code: 500,
      message: (e as Error).message,
    }
  }
})

router.post('/api/v1/problem', async (ctx) => {
  try {
    const result = await modifyProblem(ctx.request.body as AllProblem)
    if (!result) {
      ctx.response.body = {
        status: 'error',
        code: 500,
        message: 'Create problem failed!',
      }
      return
    } else {
      ctx.response.body = {
        status: 'success',
        code: result.statusCode,
        data: result._id,
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      code: 500,
      message: (e as Error).message,
    }
  }
})

router.put('/api/v1/problem/:_id', async (ctx) => {
  try {
    if (!ObjectId.isValid(ctx.params._id)) {
      ctx.response.body = {
        status: 'error',
        code: 400,
        message: 'Invalid _id',
      }
      return
    }
    const _id = ctx.params._id
    if (!_id) {
      ctx.response.body = {
        status: 'error',
        code: 400,
        message: 'Missed param _id',
      }
      return
    }
    const result = await modifyProblem(ctx.request.body as AllProblem)
    if (!result) {
      ctx.response.body = {
        status: 'error',
        code: 500,
        message: 'Update problem failed!',
      }
      return
    } else {
      ctx.response.body = {
        status: 'success',
        code: result.statusCode,
        data: result._id,
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      code: 500,
      message: (e as Error).message,
    }
  }
})

router.delete('/api/v1/problem/:_id', async (ctx) => {
  try {
    if (!ObjectId.isValid(ctx.params._id)) {
      ctx.response.body = {
        status: 'error',
        code: 400,
        message: 'Invalid _id',
      }
      return
    }
    const _id = ctx.params._id
    if (!_id) {
      ctx.response.body = {
        status: 'error',
        code: 400,
        message: 'Missed param _id',
      }
      return
    }
    const result = await deleteProblem(_id as string)
    ctx.response.body = {
      status: 'success',
      code: 204,
      data: result,
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      code: 500,
      message: (e as Error).message,
    }
  }
})

router.get('/api/v1/problem-group/:_id', async (ctx) => {
  try {
    if (!ObjectId.isValid(ctx.params._id)) {
      ctx.response.body = {
        status: 'error',
        code: 400,
        message: 'Invalid _id',
      }
      return
    }
    const _id = ctx.params._id
    const result = await getProblemGroup(_id as string)
    if (!result) {
      ctx.response.body = {
        status: 'error',
        code: 404,
        message: 'Problem Group not found!',
      }
      return
    } else {
      ctx.response.body = {
        status: 'success',
        code: 200,
        data: result,
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      code: 500,
      message: (e as Error).message,
    }
  }
})

router.post('/api/v1/problem-group', async (ctx) => {
  try {
    const result = await modifyProblemGroup(ctx.request.body as ProblemGroup)
    if (!result) {
      ctx.response.body = {
        status: 'error',
        code: 500,
        message: 'Create problem group failed!',
      }
      return
    } else {
      ctx.response.body = {
        status: 'success',
        code: result.statusCode,
        data: result._id,
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      code: 500,
      message: (e as Error).message,
    }
  }
})

router.put('/api/v1/problem-group/:_id', async (ctx) => {
  try {
    if (!ObjectId.isValid(ctx.params._id)) {
      ctx.response.body = {
        status: 'error',
        code: 400,
        message: 'Invalid _id',
      }
      return
    }
    const _id = ctx.params._id
    if (!_id) {
      ctx.response.body = {
        status: 'error',
        code: 400,
        message: 'Missed param _id',
      }
      return
    }
    const result = await modifyProblemGroup(ctx.request.body as ProblemGroup)
    if (!result) {
      ctx.response.body = {
        status: 'error',
        code: 500,
        message: 'Update problem group failed!',
      }
      return
    } else {
      ctx.response.body = {
        status: 'success',
        code: result.statusCode,
        data: result._id,
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      code: 500,
      message: (e as Error).message,
    }
  }
})

router.delete('/api/v1/problem-group/:_id', async (ctx) => {
  try {
    if (!ObjectId.isValid(ctx.params._id)) {
      ctx.response.body = {
        status: 'error',
        code: 400,
        message: 'Invalid _id',
      }
      return
    }
    const _id = ctx.params._id
    if (!_id) {
      ctx.response.body = {
        status: 'error',
        code: 400,
        message: 'Missed param _id',
      }
      return
    }
    await deleteProblemGroup(_id as string)
    ctx.response.body = {
      status: 'success',
      code: 204,
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      code: 500,
      message: (e as Error).message,
    }
  }
})

appServer.use(router.routes()).use(router.allowedMethods())

interface Request {
  pathname: string
  method: string
  request: {
    body: Record<string, unknown>
    params: Record<string, string>
  }
}

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
    },
  },
])

function getSize(times: number, div: number) {
  return {
    width: Math.floor(
      (screen.getPrimaryDisplay().workAreaSize.width * times) / div
    ),
    height: Math.floor(
      (screen.getPrimaryDisplay().workAreaSize.height * times) / div
    ),
  }
}

app.whenReady().then(() => {
  protocol.handle('app', (reg) => {
    const { pathname } = new URL(reg.url)
    const path = join(__dirname, pathname)
    if (existsSync(path)) {
      return net.fetch(pathToFileURL(path).toString())
    } else {
      return net.fetch(pathToFileURL(join(__dirname, 'index.html')).toString())
    }
  })
  // Menu.setApplicationMenu(menuTemplate)
  const baseWindow = new BrowserWindow({
    ...getSize(8, 9),
    frame: false,
    show: false,
    webPreferences: {
      preload: resolve(
        __dirname,
        process.env.NODE_ENV === 'development'
          ? './preload.js'
          : './prob-bank.preload.min.js'
      ),
      // contextIsolation: true,
      nodeIntegration: true,
      // offscreen: true,
    },
  })

  if (process.env.NODE_ENV === 'development') {
    baseWindow.loadURL(`http://localhost:5173/home`)
    baseWindow.webContents.openDevTools()
  } else {
    baseWindow.loadURL('app://./home')
    // for test
    process.env.NODE_ENV === 'development' ??
      baseWindow.webContents.openDevTools()
  }

  baseWindow.once('ready-to-show', () => {
    baseWindow.show()
  })

  baseWindow.setWindowButtonVisibility(true)

  ipcMain.on('getFonts', async (_event, options) => {
    const fonts = await getFonts(options)
    baseWindow.webContents.send('getFonts', fonts)
  })

  ipcMain.on('request', async (event, request: Request) => {
    const connection = await MongoClient.connect('mongodb://127.0.0.1:27017')
    const db = connection.db('prob-bank')
    if (request.pathname === 'problem') {
      const collection = db.collection('problems')
      if (request.method === 'gets') {
        const result = await collection.find().toArray()
        result.map((x) =>
          JSON.parse(request.request.params._id).includes(x._id.toString())
        )
        event.reply('response', {
          status: 'success',
          code: 200,
          data: result,
        })
        connection.close()
      }
    }
    connection.close()
  })
  ipcMain.on('closeBaseWindow', () => {
    baseWindow.close()
  })
  ipcMain.on('minimizeBaseWindow', () => {
    baseWindow.minimize()
  })
  ipcMain.on('maximizeBaseWindow', () => {
    baseWindow.isMaximized() ? baseWindow.unmaximize() : baseWindow.maximize()
  })
  ipcMain.on('fullscreenBaseWindow', () => {
    baseWindow.setFullScreen(!baseWindow.isFullScreen())
  })
  ipcMain.on(
    'baseWindowAction',
    (_evt, action: 'close' | 'minimize' | 'maximize' | 'fullscreen') => {
      console.log('recieved')
      switch (action) {
        case 'close':
          baseWindow.close()
          break
        case 'minimize':
          baseWindow.isMinimized()
            ? baseWindow.restore()
            : baseWindow.minimize()
          break
        case 'maximize':
          baseWindow.isMaximized()
            ? baseWindow.unmaximize()
            : baseWindow.maximize()
          break
        case 'fullscreen':
          baseWindow.setFullScreen(!baseWindow.isFullScreen())
          break
      }
    }
  )
  let printWindow: BrowserWindow | null
  ipcMain.on(
    'print',
    (
      evt,
      data: {
        metadata: {
          name: string
        }
        version: 'student' | 'description' | 'teacher' | 'answer'
      }
    ) => {
      const id = new ObjectId().toString()
      if (printWindow) {
        printWindow.destroy()
        printWindow = null
      }
      printWindow = new BrowserWindow({
        ...getSize(2, 3),
        frame: false,
        show: false,
        webPreferences: {
          preload: resolve(
            __dirname,
            process.env.NODE_ENV === 'development'
              ? './preload.js'
              : './prob-bank.preload.min.js'
          ),
          // contextIsolation: true,
          nodeIntegration: true,
        },
      })

      const url = new URL(baseWindow.webContents.getURL())

      url.searchParams.set('mode', data.version)
      url.searchParams.set('id', id)

      printWindow.loadURL(url.toString())

      // printWindow.webContents.openDevTools()

      printWindow.on('ready-to-show', () => {
        setTimeout(
          () => {
            printWindow?.webContents
              .printToPDF({
                pageSize: 'A4',
              })
              .then((buffer) => {
                let mode = '学生版'
                switch (data.version) {
                  case 'student':
                    mode = '学生版'
                    break
                  case 'teacher':
                    mode = '教师版'
                    break
                  case 'description':
                    mode = '解析版'
                    break
                  case 'answer':
                    mode = '答案版'
                    break
                  default:
                    mode = '未知'
                    break
                }
                const path = dialog.showSaveDialogSync(baseWindow, {
                  title: '保存 PDF',
                  defaultPath: `${data.metadata.name} - Problem Bank - ${mode}.pdf`,
                  filters: [
                    {
                      name: 'PDF',
                      extensions: ['pdf'],
                    },
                  ],
                })
                if (path) {
                  writeFileSync(path, buffer)
                  evt.reply('print', {
                    status: 'success',
                  })
                  shell.openPath(path)
                }
                baseWindow.webContents.send('print-step', id)
                printWindow?.close()
              })
          },
          3000 + Math.round(Math.random() * 5000)
        )
      })
    }
  )
})

app.on('window-all-closed', () => {
  app.quit()
})

appServer.listen(8080, () => {
  log.success('App server started at http://localhost:8080')
})
