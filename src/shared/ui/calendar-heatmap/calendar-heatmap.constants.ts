export const HEATMAP_COLOR_LEVELS = [
  'bg-bg-1',
  'bg-purple-200',
  'bg-purple-300',
  'bg-purple-500',
  'bg-purple-700',
] as const;

export const HEATMAP_LAYOUT = {
  mobile: {
    cellSize: 12,
    cellGap: 4,
    minWeeks: 16,
  },
  desktop: {
    cellSize: 16,
    cellGap: 4.5,
    minWeeks: 26,
  },
  maxWeeks: 53,
} as const;
