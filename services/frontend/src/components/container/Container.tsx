import type { NodeProps } from "../../types";

import styles from "./container.module.scss";

const Container = ({ children }: NodeProps) => {
  return <div className={styles.container}>{children}</div>;
};

export const MiniContainer = ({ children }: NodeProps) => {
  return <div className={styles.minicontainer}>{children}</div>;
};

export default Container;
