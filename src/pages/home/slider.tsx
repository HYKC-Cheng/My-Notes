import React, { useMemo } from 'react';
import { Menu } from 'antd';
import { useSelector } from 'react-redux';

import styles from './index.module.less';

import type { MenuProps } from 'antd';
import type { RootState } from '@/store';

interface SliderProps {
  propKey?: string;
  onChange?: (key: string) => void;
}

const Slider: React.FC<SliderProps> = (props) => {
  const { propKey, onChange } = props;

  const noteData = useSelector((state: RootState) => state.note);

  const menuItems = useMemo(() => {
    // 递归生成
    const getMenuItems = (data: RootState['note'][]) => {
      const menuItems: MenuProps['items'] = [];

      data.forEach((item) => {
        const { key, title, children } = item;
        const menuItem: (typeof menuItems)[0] = {
          key,
          label: title,
          children: children ? getMenuItems(children) : undefined,
        };

        menuItems.push(menuItem);
      });

      return menuItems;
    };

    return getMenuItems(noteData.children || []);
  }, [noteData]);

  const onClick: MenuProps['onClick'] = ({ key }) => {
    onChange?.(key);
  };

  return (
    <Menu
      selectedKeys={[propKey || '']}
      className={styles.slider}
      onClick={onClick}
      style={{ width: 300 }}
      mode='inline'
      items={menuItems}
    />
  );
};

export default Slider;
