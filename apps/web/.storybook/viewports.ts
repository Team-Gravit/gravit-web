export const RESPONSIVE_VIEWPORTS = {
  mobile: {
    name: 'Mobile · 360 × 800',
    styles: { width: '360px', height: '800px' },
    type: 'mobile',
  },
  mobileLarge: {
    name: 'Mobile Large · 430 × 932',
    styles: { width: '430px', height: '932px' },
    type: 'mobile',
  },
  tablet: {
    name: 'Tablet · 768 × 1024',
    styles: { width: '768px', height: '1024px' },
    type: 'tablet',
  },
  desktop: {
    name: 'Desktop · 1440 × 900',
    styles: { width: '1440px', height: '900px' },
    type: 'desktop',
  },
} as const;
