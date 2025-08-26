import type { NodeProps } from "../../types";

import styles from "./Main.module.scss";

const Main = ({ children }: NodeProps) => {
  return <main className={styles.main}>{children}</main>;
};

export default Main;
