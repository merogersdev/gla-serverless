import { FaXmark } from "react-icons/fa6";

import type { ItemProps } from "../../types";

import styles from "./Item.module.scss";

const Item = ({ name, onClick }: ItemProps) => {
  return (
    <li className={styles.li}>
      {name}
      <button onClick={onClick} className={styles.button}>
        <FaXmark className={styles.icon} />
      </button>
    </li>
  );
};

export default Item;
