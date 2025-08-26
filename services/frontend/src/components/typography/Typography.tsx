import type { NodeProps } from "../../types";

import styles from "./Typography.module.scss";

// H1
export const H1 = ({ children }: NodeProps) => {
  return <h1 className={styles.h1}>{children}</h1>;
};
