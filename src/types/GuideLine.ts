import type { Color } from './Color'
type options = 'vertical' | 'horizontal'

export type GuideLine = {
    position: number,
    color?: Color,
    alignment?: options,
}
