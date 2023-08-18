import { orderV2 } from './order.v2'

export function getOrderText(desc: {
  level: 0 | 1 | 2
  index: number
  origin?: string
}) {
  if (desc.level === 0) return `${desc.index}．`
  else if (desc.level === 1) return `（${desc.index}）`
  else if (desc.level === 2) return orderV2(desc.index)
}
