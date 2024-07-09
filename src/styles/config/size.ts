import type { Config } from './interface.ts';

export const sizeConfig: Config = {
  // 字体大小
  '--size-font-base': { normal: '16px', small: '14px', large: '18px' },
  '--size-font-m': { normal: '14px', small: '12px', large: '16px' },
  '--size-font-s': { normal: '12px', small: '10px', large: '14px' },
  '--size-font-l': { normal: '18px', small: '16px', large: '20px' },
  '--size-font-xl': { normal: '20px', small: '18px', large: '24px' },

  // 间距大小
  '--size-spacing-base': { normal: '8px', small: '4px', large: '8px' },
  '--size-spacing-m': { normal: '4px', small: '4px', large: '8px' },
  '--size-spacing-l': { normal: '16px', small: '8px', large: '16px' },

  // 圆角大小
  '--size-radius-base': { normal: '4px', small: '2px', large: '4px' },
};
