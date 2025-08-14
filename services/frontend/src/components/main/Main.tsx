import type { NodeProps } from "../../types";

import styles from "./main.module.scss";

const Main = ({ children }: NodeProps) => {
  return <main className={styles.main}>{children}</main>;
};

export default Main;
