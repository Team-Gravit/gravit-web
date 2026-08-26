import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'display1',
            'display2',
            'title1',
            'title2',
            'title3',
            'heading1',
            'heading2',
            'headline1',
            'headline2',
            'body1-normal',
            'body1-reading',
            'body2-normal',
            'body2-reading',
            'label1',
            'label2',
            'caption1',
            'caption2',
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
