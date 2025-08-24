import styles from "./input.module.scss";

import type { InputProps } from "../../types";

const Input = ({ name, value, onChange }: InputProps) => {
  return (
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className={styles.input}
    />
  );
};

export default Input;
