import React, { useLayoutEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import { useSelector } from 'react-redux';
import { themeConfig, sizeConfig, getNumber } from '@/styles/config';
import { setThemeStyles } from './utils';

import type { RootState } from '@/store';

interface ThemeProps {
  children?: React.ReactNode;
}

const Theme: React.FC<ThemeProps> = ({ children }) => {
  const themeType = useSelector((state: RootState) => state.theme.theme);
  const sizeType = useSelector((state: RootState) => state.theme.size);

  useLayoutEffect(() => {
    setThemeStyles(themeType, sizeType);
  }, [themeType, sizeType]);

  return (
    <ConfigProvider
      theme={{
        algorithm:
          theme[themeType === 'dark' ? 'darkAlgorithm' : 'defaultAlgorithm'],

        token: {
          // Seed Token，影响范围大
          colorPrimary: themeConfig['--theme-primary'][themeType],
          borderRadius: getNumber(sizeConfig['--size-radius-base'][sizeType]),
          colorBgBase: themeConfig['--theme-font-color-light'][themeType],
          colorTextBase: themeConfig['--theme-font-color'][themeType],
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default Theme;
