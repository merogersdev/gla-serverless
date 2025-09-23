import type { ButtonProps } from "../../types";

import { MiniSpinner } from "../spinner/Spinner";

import styles from "./Button.module.scss";

const Button = ({
  variant,
  onClick,
  children,
  type,
  Icon,
  isDisabled,
  isLoading,
}: ButtonProps) => {
  let buttonVariant;

  switch (true) {
    case isDisabled:
      buttonVariant = styles.disabled;
      break;
    case variant === "primary":
      buttonVariant = styles.primary;
      break;
    case variant === "secondary":
      buttonVariant = styles.secondary;
      break;
    case variant === "google":
      buttonVariant = styles.google;
      break;
    case variant === "outline":
      buttonVariant = styles.outline;
      break;
  }

  return (
    <button
      onClick={onClick}
      type={type}
      className={`${styles.button} ${buttonVariant}`}
      disabled={isDisabled}
    >
      {Icon && <Icon className={styles.icon} />}
      {isLoading && <MiniSpinner />}
      {children}
    </button>
  );
};

export default Button;
