import type { Meta, StoryObj } from '@storybook/react-vite';

import { ScrollArea } from './scroll-area';

const meta = {
  title: 'Primitives/ScrollArea',
  component: ScrollArea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ScrollArea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    className: 'w-80 rounded-8 border border-divider-1 p-3',
    children: (
      <div className="flex gap-2">
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="flex size-12 shrink-0 items-center justify-center rounded-8 bg-bg-1 text-label2 text-text-3"
          >
            {i + 1}
          </div>
        ))}
      </div>
    ),
  },
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    className: 'h-48 w-64 rounded-8 border border-divider-1 p-3',
    children: (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className="rounded-8 bg-bg-1 p-3 text-label2 text-text-3">
            항목 {i + 1}
          </div>
        ))}
      </div>
    ),
  },
};
