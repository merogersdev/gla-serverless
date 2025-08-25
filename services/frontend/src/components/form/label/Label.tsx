import type { LabelProps } from "../../../types";

import styles from "./label.module.scss";

const Label = ({ htmlFor, text, children }: LabelProps) => {
  return (
    <label htmlFor={htmlFor} className={styles.label}>
      <span className={styles.text}>{text}</span>
      {children}
    </label>
  );
};

export default Label;
