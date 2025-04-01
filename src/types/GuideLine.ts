import type { Color } from '@/types/Color'
type options = 'vertical' | 'horizontal'

export type GuideLine = {
    position: number,
    color?: Color,
    alignment?: options,
}
