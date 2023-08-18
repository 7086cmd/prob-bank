import MarkdownIt from "markdown-it"

const md = new MarkdownIt()

export default {
  tip: {
    validate(params: string) {
      return params.trim().match(/^tip\s+(.*)$/)
    },
    render(tokens: { info: string, nesting: number }[], idx: number) {
      const m = tokens[idx].info.trim().match(/^tip\s+(.*)$/)
      if (tokens[idx].nesting === 1) {
        return `<div class="tip custom-block"><p class="custom-block-title">${md.utils.escapeHtml(m![1])}</p>\n`
      } else {
        return `</div>\n`
      }
    }
  },
  warning: {
    validate(params: string) {
      return params.trim().match(/^warning\s+(.*)$/)
    },
    render(tokens: { info: string, nesting: number }[], idx: number) {
      const m = tokens[idx].info.trim().match(/^warning\s+(.*)$/)
      if (tokens[idx].nesting === 1) {
        return `<div class="warning custom-block"><p class="custom-block-title">${md.utils.escapeHtml(m![1])}</p>\n`
      } else {
        return `</div>\n`
      }
    }
  },
  danger: {
    validate(params: string) {
      return params.trim().match(/^danger\s+(.*)$/)
    },
    render(tokens: { info: string, nesting: number }[], idx: number) {
      const m = tokens[idx].info.trim().match(/^danger\s+(.*)$/)
      if (tokens[idx].nesting === 1) {
        return `<div class="danger custom-block"><p class="custom-block-title">${md.utils.escapeHtml(m![1])}</p>\n`
      } else {
        return `</div>\n`
      }
    }
  },
  info: {
    validate(params: string) {
      return params.trim().match(/^info\s+(.*)$/)
    },
    render(tokens: { info: string, nesting: number }[], idx: number) {
      const m = tokens[idx].info.trim().match(/^info\s+(.*)$/)
      if (tokens[idx].nesting === 1) {
        return `<div class="info custom-block"><p class="custom-block-title">${md.utils.escapeHtml(m![1])}</p>\n`
      } else {
        return `</div>\n`
      }
    }
  }
}
