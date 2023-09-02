import type { Content, TextContent } from '@/../@types/content'

export function transformTo(ctn: Content[]) {
  // The General "Content" splits `text`, `formula` and `blank` content. So we need to transform it to the specific content.
  // Usual: Merge `text`, `formula`, and `blank`
  return ctn
    .map((content) => {
      if (content.type === 'formula') {
        return {
          type: 'text',
          content: `$${content.content}$`,
        } as TextContent
      } else if (content.type === 'blank') {
        return {
          type: 'text',
          content: `!blank([${content.answer
            .map((x) => {
              if (x.type === 'text') return x.content
              else if (x.type === 'formula') return `$${x.content}$`
              else return
            })
            .join('')}])`,
        } as TextContent
      } else return content
    })
    .reduce((base, elm) => {
      if (base.length === 0) {
        base.push(elm)
        return base
      } else {
        const last = base[base.length - 1]
        if (last.type === 'text' && elm.type === 'text') {
          last.content += elm.content
          return base
        } else {
          base.push(elm)
          return base
        }
      }
    }, [] as Content[])
}

export function transformFrom(ctn: Content[]) {
  function transformText(ctn: TextContent) {
    return ctn.content
      .split('$')
      .filter((x) => x)
      .map((x, i) => ({
        type:
          i % 2 === (ctn.content.startsWith('$') ? 1 : 0) ? 'text' : 'formula',
        content: x,
      })) as Content[]
  }
  function transformBlank(ctn: TextContent) {
    if (!ctn.content.includes('!blank([')) return transformText(ctn)
    const blanks = ctn.content.split('!blank([')
    const result = blanks.reduce((prev, cur, ix) => {
      if (ix === 0) {
        prev.push(
          ...transformText({
            type: 'text',
            content: cur,
          })
        )
      } else {
        const answer = cur.split('])')[0]
        const text = cur.split('])').slice(1).join('])')
        prev.push({
          type: 'blank',
          answer: transformText({
            type: 'text',
            content: answer,
          }),
        })
        prev.push(
          ...transformText({
            type: 'text',
            content: text,
          })
        )
      }
      return prev
    }, [] as Content[])
    return result
  }
  const result = ctn.reduce((prev, cur) => {
    if (cur.type === 'text') {
      prev.push(...transformBlank(cur))
    } else {
      prev.push(cur)
    }
    return prev
  }, [] as Content[])
  return result
}
