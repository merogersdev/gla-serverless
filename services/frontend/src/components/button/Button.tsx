import type { ButtonProps } from "../../types";

import styles from "./Button.module.scss";

const Button = ({
  variant,
  onClick,
  children,
  type,
  Icon,
  isDisabled,
}: ButtonProps) => {
  const buttonVariant = isDisabled
    ? styles.disabled
    : variant === "primary"
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
      disabled={isDisabled}
    >
      {Icon && <Icon className={styles.icon} />}
      {children}
    </button>
  );
};

export default Button;
