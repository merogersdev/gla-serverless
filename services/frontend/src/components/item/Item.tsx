import { FaXmark } from "react-icons/fa6";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import type { ItemProps } from "../../types";

import { capitalizeName } from "../../utils/format";

import styles from "./Item.module.scss";
import { deleteItem } from "../../utils/fetch";

const Item = ({ VALUE }: ItemProps) => {
  const queryClient = useQueryClient();

  const deleteItemMutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast.success("Item Removed");
    },
    onError: async (error) => {
      console.error(error);
      toast.error("Unable to add item");
    },
  });

  const handleDelete = async (value: string) => {
    deleteItemMutation.mutate(value);
  };

  return (
    <li className={styles.li}>
      {capitalizeName(VALUE)}
      <button onClick={() => handleDelete(VALUE)} className={styles.button}>
        <FaXmark className={styles.icon} />
      </button>
    </li>
  );
};

export default Item;
