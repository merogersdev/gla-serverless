import Item from "../Item";

import type { ItemListProps } from "../../../types";

import styles from "./List.module.scss";

const List = ({ items, message = "No items to display" }: ItemListProps) => {
  if (items.length === 0)
    return <div className={styles.message}>{message}</div>;
  return (
    <ul className={styles.ul}>
      {items.map(({ name, id }) => (
        <Item key={id} name={name} id={id} onClick={() => console.log(id)} />
      ))}
    </ul>
  );
};

export default List;
