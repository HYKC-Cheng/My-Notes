export { themeConfig } from './theme';
export { sizeConfig } from './size';

export const getNumber = (str: string) => {
  return Number(str.replace(/\D/g, ''));
};
