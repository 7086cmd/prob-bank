# 类型声明：题目

“题目”在`prob-bank`中是以`Problem`对象储存在`MongoDB`数据库中的`Problem`集合。其中，主要声明有以下字段：

```typescript
declare interface Problem {
  _id: string // 由 MongoDB 自动生成
  type:
    | 'single-choice'
    | 'mutiple-choice'
    | 'blank'
    | 'program'
    | 'answer'
    | 'judge'
    | 'discuss' // 题目类型
  origin: string // 题目来源
  content: Content // 题目内容
  description: string // 题目描述
  difficulty: number // 题目难度，范围为 0 ~ 1 (0.1)，以平均分占总分为计
  tags: string[] // 题目标签
  score: number // 题目分值
  level: ['P' | 'J' | 'S' | 'U' | 'V', number] // 题目等级，第一个元素为 P、J、S、U 中的一个，第二个元素为该等级下的序号。其中，P 代表小学，J 代表初中，S 代表高中，V 代表中职，U 代表大学
}
```

根据不同类型的题目，我们将`Problem`定义为以下几种类型的集合：`ChoiceProblem`、`BlankProblem`、`ProgramProblem`、`AnswerProblem`、`JudgeProblem`、`DiscussProblem`。

## 选择题：`ChoiceProblem`，包括单选和多选

```typescript
declare interface SingleChoiceProblem extends Problem {
  type: 'single-choice'
  options: string[]
  answer: string
}

declare interface MultipleChoiceProblem extends Problem {
  type: 'multiple-choice'
  options: string[]
  answer: string[]
}
```

## 填空题：`BlankProblem`

```typescript
declare interface BlankProblem extends Problem {
  type: 'blank'
  answer: string[]
  subProblems: BlankProblem[]
}
```

## 解答题：`ProgramProblem`

```typescript
declare interface ProgramProblem extends Problem {
  type: 'program'
  answer: string // 答案
  procedure: string // 答案解析
  subProblems: ProgramProblem[] // 子题目
}
```

## 简答题：`AnswerProblem`

```typescript
declare interface AnswerProblem extends Problem {
  type: 'answer'
  answer: string // 答案
  procedure: string // 答案解析
  subProblems: AnswerProblem[] // 子题目
}
```

## 判断题：`JudgeProblem`

```typescript
declare interface JudgeProblem extends Problem {
  type: 'judge'
  answer: boolean // 答案
  procedure: string // 答案解析
}
```

## 论述题：`DiscussProblem`

```typescript
declare interface DiscussProblem extends Problem {
  type: 'discuss'
  example: string // 答案示例
  procedure: string // 答案解析
  subProblems: DiscussProblem[] // 子题目
}
```
