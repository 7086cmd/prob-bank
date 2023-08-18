import type { Content, TextContent } from '../../@types/content'

function selfDefinedModule(
  defineKey: string,
  resultKey: string,
  inputStr: string,
  resultType: 'Content' | 'string' = 'string'
) {
  // type: !define_key[value], which returns with Content: { [resultKey]: content, type: defineKey }
  // The most hard part is that after processing, it will be an object array instead of string. So we must process the text per array item.
  // But in this function, we only process the text, so we can use the `md` to process the text.

  const contents = inputStr.split(`!${defineKey}[`)
  const result = [] as (Record<string, string | Content[]> & { type: string })[]
  contents.forEach((content, idx) => {
    if (idx === 0) {
      // not in self defined area
      result.push({
        type: 'text',
        content: content,
      })
    } else {
      const value = content.split(']')[0]
      const text = content.split(']').slice(1).join(']')
      result.push({
        type: defineKey,
        [resultKey]: resultType === 'string' ? value : md2c(value),
      })
      result.push({
        type: 'text',
        content: text,
      })
    }
  })

  return result
}

function textToSelfDefinedModule(
  inputs: Content[],
  defineKey: string,
  resultKey: string,
  resultType: 'Content' | 'string' = 'string'
) {
  const result = [] as Content[]
  inputs.forEach((item) => {
    if (item.type === 'text') {
      result.push(
        ...(selfDefinedModule(
          defineKey,
          resultKey,
          item.content,
          resultType
        ) as unknown as Content[])
      )
    } else {
      result.push(item)
    }
  })
  return result
}

function exposeFormula(items: Content[]) {
  // type: $formula$, which returns with Content: { type: 'formula', content: formula }
  const result = [] as Content[]
  items.forEach((text) => {
    if (text.type === 'text') {
      const contents = text.content.split('$')
      contents.forEach((content, idx) => {
        if (idx % 2 === 0) {
          result.push({
            type: 'text',
            content: content,
          })
        } else {
          result.push({
            type: 'formula',
            content: content,
          })
        }
      })
    } else {
      result.push(text)
    }
  })
  return result
}

export function md2c(text: string) {
  // 空格格式： !blank[(answer)]
  // 其中，answer 为答案，与 text 相同，也是需要解析的内容
  // const contents = text.split('!blank[')
  // const result = [] as Content[]
  // contents.forEach((content, idx) => {
  //   if (idx !== 0) {
  //     const answer = content.split(']')[0]
  //     const text = content.split(']').slice(1).join(']')
  //     result.push({
  //       type: 'blank',
  //       answer: md2c(answer),
  //     })
  //     const list = text.split('$')

  //     list.forEach((item, index) =>
  //       result.push({
  //         type: index % 2 === 0 ? 'text' : 'formula',
  //         content: item,
  //       })
  //     )
  //   } else {
  //     const list = content.split('$')
  //     list.forEach((item, index) =>
  //       result.push({
  //         type: index % 2 === 0 ? 'text' : 'formula',
  //         content: item,
  //       })
  //     )
  //   }
  // })

  let result: Content[] = []

  const txt = { type: 'text', content: text } as TextContent

  result = textToSelfDefinedModule([txt], 'blank', 'answer', 'Content') as unknown as Content[]

  result = textToSelfDefinedModule(result, 'textarea', 'content') as unknown as Content[]

  result = exposeFormula(result)

  return result.filter((item) => !(item.type === 'text' && item.content === ''))
}
