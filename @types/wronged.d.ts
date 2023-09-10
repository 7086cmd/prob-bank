/**
 * 由于 Problem Bank 的自动排版的优越性，因此我决定把它拿来整理错题。
 */
import type { Content } from './content'

declare interface WrongType {
  value: string
  subjects: (
    | 'Chinese'
    | 'Math'
    | 'English'
    | 'Physics'
    | 'Chemistry'
    | 'Biology'
    | 'Politics'
    | 'History'
    | 'Geography'
    | 'IT'
    | 'General Technology'
    | 'Others'
  )[]
  label: string
}

declare interface Wrong {
  type: string
  reason: Content[]
  lesson: Content[]
}
