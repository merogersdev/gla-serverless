import type { InputProps } from "../../../types";

import styles from "./Input.module.scss";

const Input = ({ name, value, onChange, placeholder, type }: InputProps) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={styles.input}
      placeholder={placeholder}
    />
  );
};

export default Input;
