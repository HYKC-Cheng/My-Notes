import { themeConfig, sizeConfig } from '@/styles/config';
import type { Config } from '@/styles/config/interface';

import type { RootState } from '@/store';

const getCssString = (config: Config, theme: string) => {
  return Object.keys(config).reduce((acc, key) => {
    acc += `${key}: ${config[key][theme]};\n`;
    return acc;
  }, '');
};

export const setThemeStyles = (
  theme: RootState['theme']['theme'],
  size: RootState['theme']['size'],
) => {
  const themeString = getCssString(themeConfig, theme);
  const sizeString = getCssString(sizeConfig, size);

  const cssString = `
    :root {
      ${themeString}
      ${sizeString}
    }
  `;

  const styleEle = document.head.querySelector('#theme-styles');

  if (!styleEle) {
    const style = document.createElement('style');
    style.setAttribute('id', 'theme-styles');
    style.textContent = cssString;
    document.head.appendChild(style);
    return;
  }

  styleEle.textContent = cssString;
};
