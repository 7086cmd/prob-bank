const sentences = [
  '随机空行彩蛋，仅支持学生版导出哦',
  'Problem Bank 不是 Bank',
  '本应用不支持 Homo 数学！',
  '大丘丘病了，二丘丘瞧；三丘丘买药，四丘丘嗷',
  '逸一时，误一世，逸久逸久罢已零',
  '欲买桂花同载酒，只可惜故人，何日再见呢？',
  '帮帮我！师瓦罗先生！——离开克拉拉！',
  '随蝴蝶一起消散吧，旧日的幻影！',
  '我们早已踏入风暴，为了守护和捍卫，击溃他们！',
]
export default {
  sentences,
  get(id: number = Math.floor(Math.random() * sentences.length)) {
    return sentences[id]
  }
}
