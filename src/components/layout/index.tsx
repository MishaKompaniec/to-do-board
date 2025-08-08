import { type FC } from 'react';
import styles from './layout.module.css';
import { Header } from '../header';
import type { LayoutProps } from '../../types';

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Header />
      <main>{children}</main>
    </div>
  );
};

export { Layout };
