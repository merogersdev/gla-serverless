import { FormEvent, useState, useRef, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { addItem } from "../../../utils/fetch";
import { nameRegex } from "../../../utils/validate";

import type { ItemProps } from "../../../types";

import styles from "./Add.module.scss";

const Add = ({ items }: { items: ItemProps[] }) => {
  const [newItem, setNewItem] = useState("");
  const [isAddPending, setIsAddPending] = useState(false);

  const queryClient = useQueryClient();
  const newItemRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: any) => setNewItem(e.target.value);

  const addItemMutation = useMutation({
    mutationFn: () => {
      const alreadyExists = items.some(
        (item) => item.VALUE.toLowerCase() === newItem.toLowerCase()
      );

      if (alreadyExists) throw new Error("Item Already Exists");

      return addItem(newItem.toLowerCase());
    },
    onSuccess: async () => {
      setNewItem("");
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast.success("Item added");
      newItemRef?.current?.focus();
    },
    onError: async (error) => {
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.error("Unable to add item");
    },
    onSettled: () => {
      setIsAddPending(false);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isAddPending) return;
    setIsAddPending(true);
    if (newItem === "") {
      toast.error("Item cannot be blank");
      setIsAddPending(false);
      return;
    }
    if (!nameRegex.test(newItem)) {
      toast.error("Item names must not contain special characters");
      setIsAddPending(false);
      return;
    }

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
      <button className={styles.button} type="submit" disabled={isAddPending}>
        <FaPlus className={styles.icon} />
      </button>
    </form>
  );
};

export default Add;
