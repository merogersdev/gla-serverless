import type { FormProps } from "react-router-dom";

import styles from "./form.module.scss";
import { NodeProps } from "../../types";

const Form = ({ onSubmit, name, id, children }: FormProps) => {
  return (
    <form onSubmit={onSubmit} name={name} id={id} className={styles.form}>
      {children}
    </form>
  );
};

export const FormSeparator = ({ children }: NodeProps) => {
  return (
    <div className={styles.separator}>
      <span className={styles.text}>{children}</span>
    </div>
  );
};

export default Form;
