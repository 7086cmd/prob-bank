import chalk from 'chalk'
import dayjs from 'dayjs'

// not only a structure, but also a function that can use `log()` instead of `log.log()`
const log = {
  info: (msg: string) =>
    console.log(
      chalk.gray(dayjs().format('YYYY-MM-DD HH:mm:ss')),
      chalk.blue(msg)
    ),
  warn: (msg: string) =>
    console.log(
      chalk.gray(dayjs().format('YYYY-MM-DD HH:mm:ss')),
      chalk.yellow(msg)
    ),
  error: (msg: string) =>
    console.log(
      chalk.gray(dayjs().format('YYYY-MM-DD HH:mm:ss')),
      chalk.red(msg)
    ),
  success: (msg: string) =>
    console.log(
      chalk.gray(dayjs().format('YYYY-MM-DD HH:mm:ss')),
      chalk.green(msg)
    ),
  debug: (msg: string) =>
    console.log(
      chalk.gray(dayjs().format('YYYY-MM-DD HH:mm:ss')),
      chalk.magenta(msg)
    ),
  log: (msg: string) =>
    console.log(
      chalk.gray(dayjs().format('YYYY-MM-DD HH:mm:ss')),
      chalk.white(msg)
    ),
}

export { log }
