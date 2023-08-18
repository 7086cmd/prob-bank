import { Menu, MenuItem, app } from 'electron'

const macOSMenu = {
  label: app.name,
  submenu: [
    { role: 'about' },
    { type: 'separator' },
    { role: 'services' },
    { type: 'separator' },
    { role: 'hide' },
    { role: 'hideothers' },
    { role: 'unhide' },
    { type: 'separator' },
    { role: 'quit' },
  ],
}

const fileMenu = {
  label: '文件',
  submenu: [
    {
      type: 'normal',
      label: '打开',
      accelerator: 'CmdOrCtrl+O',
    },
    {
      type: 'normal',
      label: '保存',
      accelerator: 'CmdOrCtrl+S',
    },
    { type: 'separator' },
    process.platform === 'darwin' ? { role: 'close' } : { role: 'quit' },
  ],
}

const navigateMenu = {
  label: '编辑',
  submenu: [
    {
      type: 'normal',
      label: '上一面',
      accelerator: 'CmdOrCtrl+]',
    },
    {
      type: 'normal',
      label: '下一面',
      accelerator: 'CmdOrCtrl+[',
    },
    { type: 'separator' },
    {
      type: 'normal',
      label: '题目',
    },
    {
      type: 'normal',
      label: '题组',
    },
    {
      type: 'normal',
      label: '组卷',
    },
  ],
}

const menu = [
  macOSMenu,
  fileMenu,
  navigateMenu,
  { role: 'window' },
  { role: 'help' },
]

export const menuTemplate = Menu.buildFromTemplate(menu as unknown as MenuItem[])
