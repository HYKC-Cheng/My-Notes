import React from 'react';
import styles from './index.module.less';
import logoIcon from '@/static/icons/logo.svg';

const Header: React.FC = () => {
  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <img src={logoIcon} alt='logo' className={styles.logo} />
        <span className={styles.title}>我的笔记</span>
      </div>
      <div className={styles.right}>
        <span>Knowledge is power</span>
        <span>/</span>
        <span>知 识 就 是 力 量</span>
      </div>
    </div>
  );
};

export default Header;
