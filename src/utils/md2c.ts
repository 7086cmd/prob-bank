// Markdown Converter

export function md2c(text: string) {
  // From Markdown to Content, the most important part is to separate tex and text with the label "$". Normally, we don't use "$$" part.

  const list = text.split('$')

  return JSON.stringify(list.map((item, index) => ({
    type: index % 2 === 0 ? 'text' : 'formula',
    content: item,
  })))
}
