import { cva } from 'class-variance-authority';

export const inlineButtonVariants = cva(
  [
    'inline-flex items-center justify-center rounded-lg',
    'transition-color duration-200 ease-in-out',
    'cursor-pointer',
    'disabled:bg-cta-disabled disabled:text-white disabled:stroke-white disabled:border-cta-disabled disabled:pointer-events-none',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-cta text-white hover:bg-cta-hover',
        secondary: 'bg-cta-secondary-default text-cta-secondary-text hover:bg-cta-secondary-hover',
        strokeGray: 'bg-bg-1 border border-divider-2 text-text-3 hover:bg-text-3 hover:text-white',
        strokePrimary: 'bg-bg-0 border border-cta text-cta hover:bg-cta hover:text-white',
      },
      size: {
        sm: 'px-4 py-2 text-label2',
        md: 'px-4 py-[6.5px] text-body1-normal',
        lg: 'px-5 py-[10.5px] text-heading',
        custom: '',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export const blockButtonVariants = cva(
  [
    'w-full flex items-center justify-center',
    'transition-color duration-200 ease-in-out',
    'cursor-pointer',
    'disabled:bg-[#dcdcdc] disabled:text-white disabled:pointer-events-none',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-cta text-white hover:bg-cta-hover',
        secondary: 'bg-cta-secondary-default text-cta-secondary-text hover:bg-cta-secondary-hover',
        strokeGray: 'bg-bg-0 border border-divider-1 text-text-2 hover:bg-text-2 hover:text-white',
        strokePrimary:
          'bg-bg-0 border border-divider-1 text-cta hover:bg-[#9b00cf] hover:text-white',
      },
      size: {
        md: 'h-[37px] md:h-[56px] rounded-sm md:rounded-lg font-medium text-[14px] md:text-lg',
        custom: '',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);
