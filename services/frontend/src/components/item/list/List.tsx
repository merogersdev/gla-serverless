import { motion, AnimatePresence } from "framer-motion";

import Item from "../Item";

import type { ItemListProps } from "../../../types";

import styles from "./List.module.scss";

const List = ({ items, message = "No items to display" }: ItemListProps) => {
  if (items && items.length === 0)
    return <div className={styles.message}>{message}</div>;
  return (
    <ul className={styles.ul}>
      <AnimatePresence>
        {items &&
          items.map(({ SK, PK, CHECKED, VALUE }) => (
            <motion.div
              key={SK}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Item SK={SK} VALUE={VALUE} PK={PK} CHECKED={CHECKED} />
            </motion.div>
          ))}
      </AnimatePresence>
    </ul>
  );
};

export default List;
