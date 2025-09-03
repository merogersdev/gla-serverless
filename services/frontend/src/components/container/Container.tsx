import type { NodeProps } from "../../types";

import styles from "./Container.module.scss";

const Container = ({ children }: NodeProps) => {
  return <div className={styles.container}>{children}</div>;
};

export const MiniContainer = ({ children }: NodeProps) => {
  return <div className={styles.minicontainer}>{children}</div>;
};

export const LoadingContainer = ({ children }: NodeProps) => {
  return <div className={styles.loadingcontainer}>{children}</div>;
};

export default Container;
