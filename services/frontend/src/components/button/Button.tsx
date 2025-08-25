import type { ButtonProps } from "../../types";

import styles from "./button.module.scss";

const Button = ({ variant, onClick, children, type, Icon }: ButtonProps) => {
  const buttonVariant =
    variant === "primary"
      ? styles.primary
      : variant === "secondary"
      ? styles.secondary
      : variant === "outline"
      ? styles.outline
      : "";
  return (
    <button
      onClick={onClick}
      type={type}
      className={`${styles.button} ${buttonVariant}`}
    >
      {Icon && <Icon className={styles.icon} />}
      {children}
    </button>
  );
};

export default Button;
