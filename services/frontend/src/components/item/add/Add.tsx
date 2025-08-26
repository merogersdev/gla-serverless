import { FormEvent, useState } from "react";

import { FaPlus } from "react-icons/fa6";

import styles from "./Add.module.scss";

const Add = () => {
  const [newItem, setNewItem] = useState("");

  const handleChange = (e: any) => setNewItem(e.target.value);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(newItem);
    setNewItem("");
  };

  return (
    <form className={styles.add} onSubmit={handleSubmit}>
      <input
        onChange={handleChange}
        value={newItem}
        className={styles.input}
        placeholder="Add Item"
        aria-label="Add Item"
      />
      <button className={styles.button} type="submit">
        <FaPlus className={styles.icon} />
      </button>
    </form>
  );
};

export default Add;
