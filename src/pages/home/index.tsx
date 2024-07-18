import React from 'react';
import { Flex } from 'antd';
import { Header, Slider } from '@/components';
// import Slider from './slider';
import Content from './content';

const Home: React.FC = () => {
  return (
    <>
      <Header />
      <Flex justify='space-between'>
        <Slider />
        <Content />
      </Flex>
    </>
  );
};

export default Home;
