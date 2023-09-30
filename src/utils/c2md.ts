import type { Content } from '@/../@types/content'

export function c2md(content: Content[]): string {
  console.log(content)
  const result = content
    .map((ctn: Content) => {
      if (ctn.type === 'text') {
        return ctn.content
      } else if (ctn.type === 'formula') {
        return `$${ctn.content}$`
      } else if (ctn.type === 'blank') {
        return `!blank[${c2md(ctn.answer)}]`
      } else if (ctn.type === 'textarea') {
        return `!textarea[${ctn.content}]`
      } else if (ctn.type === 'image') {
        return `![${ctn.alt}](${ctn.src})`
      }
    })
    .join('')
  return result
}
