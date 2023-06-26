# 类型声明：试卷/组卷

这是最高级别的类型，是所有“大题组”的集合。

```typescript
declare interface Paper {
  _id: string
  title: string // 试卷标题
  description: string // 试卷描述
  questionSets: QuestionSet[] // 大题组
  type: 'paper' | 'test' // 试卷类型
}
```
