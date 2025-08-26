import type { InputProps } from "../../../types";

import styles from "./Input.module.scss";

const Input = ({ name, value, onChange, placeholder }: InputProps) => {
  return (
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className={styles.input}
      placeholder={placeholder}
    />
  );
};

export default Input;
