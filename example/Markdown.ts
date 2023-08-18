const MarkdownIt = require("markdown-it")
const sub = require("markdown-it-sub")
const sup = require("markdown-it-sup")

const md = MarkdownIt()

md.use(sub).use(sup)

console.log(md.render("H~2~O"))
