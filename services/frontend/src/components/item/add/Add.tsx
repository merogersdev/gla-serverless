import { FormEvent, useState, useRef, useEffect } from "react";

import { FaPlus } from "react-icons/fa6";

import { addItem } from "../../../utils/fetch";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "react-toastify";

import styles from "./Add.module.scss";

const Add = () => {
  const [newItem, setNewItem] = useState("");

  const queryClient = useQueryClient();
  const newItemRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: any) => setNewItem(e.target.value);

  const addItemMutation = useMutation({
    mutationFn: () => addItem(newItem.toLowerCase()),
    onSuccess: async () => {
      setNewItem("");
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast.success("Item added");
      newItemRef?.current?.focus();
    },
    onError: async () => {
      toast.error("Unable to add item");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    addItemMutation.mutate();
  };

  useEffect(() => {
    newItemRef?.current?.focus();
  }, [newItemRef]);

  return (
    <form className={styles.add} onSubmit={handleSubmit}>
      <input
        onChange={handleChange}
        value={newItem}
        className={styles.input}
        placeholder="Add Item"
        aria-label="Add Item"
        ref={newItemRef}
      />
      <button className={styles.button} type="submit">
        <FaPlus className={styles.icon} />
      </button>
    </form>
  );
};

export default Add;
