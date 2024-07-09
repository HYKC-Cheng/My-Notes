import React, { useState, useEffect } from 'react';
import { Flex } from 'antd';
import { Header } from '@/components';
import { useSelector } from 'react-redux';
import Slider from './slider';
import Content from './content';

import type { RootState } from '@/store';

const Home: React.FC = () => {
  const noteData = useSelector((state: RootState) => state.note);

  const [key, setKey] = useState<string>('');

  useEffect(() => {
    const getFirstKey = (data: RootState['note'][]) =>
      data.find((item) => {
        if (!item.children) {
          return item.key;
        }
        getFirstKey(item.children);
      });

    const curKey = getFirstKey(noteData.children || [])?.key || '';

    setKey(curKey);
  }, [noteData]);

  const handleChange = (key: string) => {
    const children = noteData?.children?.find(
      (item) => item.key === key,
    )?.children;
    if (children && children.length) {
      return;
    }

    setKey(key);
  };

  return (
    <>
      <Header />
      <Flex justify='space-between'>
        <Slider propKey={key} onChange={handleChange} />
        <Content propKey={key} />
      </Flex>
    </>
  );
};

export default Home;
