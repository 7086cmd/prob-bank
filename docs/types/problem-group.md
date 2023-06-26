# 类型声明：题组

题组主要出现在文科，主要特点是根据一段材料等，题目序号按照整张试卷上来，而不是当作小题，如完型填空、语法填空等。

题组的类型声明如下：

```typescript
declare interface ProblemGroup {
  type: 'group'
  title: string // 题组标题
  removable: boolean // 是否可删除
  problems: (Problem | Omit<Problem, '_id'>)[] // 题目列表
}
```

主要地，将题组分类为“可拆卸”式和“不可拆卸”式。前者题目可以单独拆开，后者题目一起做和单独做差异较大。

题组的声明如下：

## “可拆卸”式

```typescript
declare interface RemovableProblemGroup extends ProblemGroup {
  removable: true
  problems: Problem[]
}

declare interface UnremovableProblemGroup extends ProblemGroup {
  removable: false
  problems: Omit<Problem, '_id'>[]
}

```
