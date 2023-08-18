import { md2c } from '../src/utils/md2c'

const lib = [
  '已知集合$A=\\left\\{x\\in \\mathbb{R} \\mid -2\\leqslant x \\leqslant 3\\right\\}$，则$\\complement_{\\mathbb{R}} A$为!blank[$\\left\\{x \\mid x \\leqslant-2 \\text{或} x \\geqslant 3\\right\\}$]．',
]

lib.forEach((item) => {
  console.log(md2c(item))
})
