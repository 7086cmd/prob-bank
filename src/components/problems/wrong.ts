import type { WrongType } from '@/../@types/wronged'

const allSubjects = [
  'Chinese',
  'Math',
  'English',
  'Physics',
  'Chemistry',
  'Biology',
  'Politics',
  'History',
  'Geography',
  'IT',
  'General Technology',
  'Others',
]

export const wrongTypes = [
  {
    value: 'reviewing',
    subjects: allSubjects,
    label: '审题性错误',
  },
  {
    value: 'calculation',
    subjects: ['Math', 'Physics', 'Chemistry'],
    label: '计算性错误',
  },
  {
    value: 'concept',
    subjects: ['Math', 'Physics', 'Chemistry', 'English'],
    label: '概念性错误',
  },
  {
    value: 'knowledge',
    subjects: allSubjects,
    label: '知识性错误',
  },
  {
    value: 'careless',
    subjects: allSubjects,
    label: '粗心性错误',
  },
  {
    value: 'other',
    subjects: allSubjects,
    label: '其他错误',
  },
] as WrongType[]

export function getWrongType(value: string): string {
  if (value === '') return '无'
  return `<span style="font-family: 'Source Han Sans'">${
    wrongTypes.find((type) => type.value === value)!.label
  }</span>`
}
