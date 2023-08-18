import { lstatSync, readFileSync, readdirSync, writeFileSync } from 'fs'
import { resolve } from 'path'

function read(path = '.') {
  const list = readdirSync(resolve(path))

  list.forEach((file) => {
    // Check if it is a file
    if (lstatSync(resolve(path, file)).isFile()) {
      if (file.endsWith('.vue'))
        writeFileSync(
          readFileSync(resolve(path, file))
            .toString()
            .replace('<script setup>', '<script setup>\n// @ts-nocheck'),
          resolve(path, file)
        )
      else if (file.endsWith('.ts'))
        writeFileSync(
          '// @ts-nocheck\n' + readFileSync(resolve(path, file)).toString(),
          resolve(path, file)
        )
    } else {
      read(resolve(path, file))
    }
  })
}

read()
