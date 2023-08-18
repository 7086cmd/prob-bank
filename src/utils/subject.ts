export const sbjs = [
  { label: '语文', value: 'Chinese' },
  { label: '数学', value: 'Math' },
  { label: '英语', value: 'English' },
  { label: '物理', value: 'Physics' },
  { label: '化学', value: 'Chemistry' },
  { label: '生物', value: 'Biology' },
  { label: '政治', value: 'Politics' },
  { label: '历史', value: 'History' },
  { label: '地理', value: 'Geography' },
  { label: '信息技术', value: 'IT' },
  { label: '通用技术', value: 'General Technology' },
  { label: '其他', value: 'Other' },
]

export const levs = [
  { label: '小学', value: 'P' },
  { label: '初中', value: 'J' },
  { label: '高中', value: 'S' },
  { label: '大学', value: 'U' },
  { label: '中职', value: 'V' },
]

const numords = ['', '一', '二', '三', '四', '五', '六']

export function getGradeSubjectName(grade: ['P' | 'J' | 'S' | 'U' | 'V', number], subject: string) {
  const subjects = {} as Record<string, string>
  sbjs.forEach(item => {
    subjects[item.value] = item.label
  })
  switch (grade[0]) {
    case 'P': {
      return `${numords[grade[1]]}年级${subjects[subject]}`
    }
    case 'J': {
      return `初${numords[grade[1]]}${subjects[subject]}`
    }
    case 'S': {
      return `高${numords[grade[1]]}${subjects[subject]}`
    }
    case 'U': {
      return `大${numords[grade[1]]}${subjects[subject]}`
    }
    case 'V': {
      return `不支持（不配）`
    }
  }
}