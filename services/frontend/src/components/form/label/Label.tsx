import type { LabelProps } from "../../../types";

import styles from "./Label.module.scss";

const Label = ({ htmlFor, ariaLabel, children }: LabelProps) => {
  return (
    <label htmlFor={htmlFor} className={styles.label} aria-label={ariaLabel}>
      {children}
    </label>
  );
};

export default Label;
