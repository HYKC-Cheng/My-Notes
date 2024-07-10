import React from 'react';
import { Editor } from '@/components';

import styles from './index.module.less';

const Content: React.FC = () => {
  return (
    <div className={styles.content}>
      <Editor />
    </div>
  );
};

export default Content;
