import type { Meta, StoryObj } from '@storybook/react-vite';

import { ScrollArea } from '@/shared/ui/scroll';

import { CalendarHeatmap } from './calendar-heatmap';
import type { CalendarHeatmapValue } from './calendar-heatmap.model';

/** 올해 1월부터 오늘까지 임의 학습량을 채운 샘플 데이터. */
function makeSampleValues(): CalendarHeatmapValue[] {
  const year = new Date().getFullYear();
  const start = new Date(year, 0, 1);
  const today = new Date();
  const values: CalendarHeatmapValue[] = [];

  for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
    const date = d.toISOString().slice(0, 10);
    values.push({ date, count: Math.floor(Math.random() * 12) });
  }
  return values;
}

const meta = {
  title: 'Primitives/CalendarHeatmap',
  component: CalendarHeatmap,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CalendarHeatmap>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { values: makeSampleValues() },
  render: (args) => (
    <ScrollArea orientation="horizontal" className="max-w-full">
      <CalendarHeatmap {...args} />
    </ScrollArea>
  ),
};

export const Empty: Story = {
  args: { values: [] },
  render: (args) => (
    <ScrollArea orientation="horizontal" className="max-w-full">
      <CalendarHeatmap {...args} />
    </ScrollArea>
  ),
};
