import type { FormProps } from "react-router-dom";

import styles from "./form.module.scss";

const Form = ({ onSubmit, name, id, children }: FormProps) => {
  return (
    <form onSubmit={onSubmit} name={name} id={id} className={styles.form}>
      {children}
    </form>
  );
};

export default Form;
