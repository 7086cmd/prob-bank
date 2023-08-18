// fron Content to DisplayContent, the most important key is let `formula` into `text` that with `$`.

import type { Content, TextContent } from '@/../@types/content'

export function content2display(ctn: Content[]): Content[] {
  // Step 1: map `formula` to `text`
  const result = ctn.map((item) => {
    if (item.type === 'formula') {
      return {
        type: 'text',
        content: `$${item.content}$`
      } as TextContent
    } else {
      return item
    }
  })

  // Step 2: merge `text` and `text`
  const merged = [] as Content[]

  result.forEach((item) => {
    if (item.type === 'text') {
      if (merged.length === 0) {
        merged.push(item)
      } else {
        const last = merged[merged.length - 1]
        if (last.type === 'text') {
          last.content += item.content
        } else {
          merged.push(item)
        }
      }
    } else {
      merged.push(item)
    }
  })

  return merged
}
