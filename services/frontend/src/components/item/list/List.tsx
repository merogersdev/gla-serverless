import { motion, AnimatePresence } from "framer-motion";

import Item from "../Item";

import type { ItemListProps, ItemProps } from "../../../types";

import styles from "./List.module.scss";

const List = ({ items, message = "No items to display" }: ItemListProps) => {
  if (items && items.length === 0)
    return <div className={styles.message}>{message}</div>;

  // Filter out items and sort alphabetically
  const sortItems = (
    items: ItemProps[] | undefined | null,
    checked: boolean
  ) => {
    if (!items) return;
    const filteredItems = items.filter(
      (item: ItemProps) => item.CHECKED === checked
    );
    const sortedItems = filteredItems.sort((a: ItemProps, b: ItemProps) => {
      const itemA = a.VALUE.toLowerCase();
      const itemB = b.VALUE.toLowerCase();

      if (itemA < itemB) return -1;
      if (itemA > itemB) return 1;
      return 0;
    });
    return sortedItems;
  };

  const activeItems = sortItems(items, false);
  const inactiveItems = sortItems(items, true);

  return (
    <>
      <ul className={styles.ul}>
        <AnimatePresence>
          {activeItems &&
            activeItems.map(({ SK, PK, CHECKED, VALUE }) => (
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
      <ul className={styles.ul}>
        <AnimatePresence>
          {inactiveItems &&
            inactiveItems.map(({ SK, PK, CHECKED, VALUE }) => (
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
    </>
  );
};

export default List;
