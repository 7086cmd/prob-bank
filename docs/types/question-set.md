# 类型声明：大题组

大题组在本处应当是不精切的说法，具体的就是如“一、选择题”等的内容。声明如下：

```typescript
declare interface QuestionSet {
  type: 'question-set'
  title: string // 大题组标题
  problems: (Problem | ProblemGroup)[] // 题目
}
```
