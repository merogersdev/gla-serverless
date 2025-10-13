import { FaXmark } from "react-icons/fa6";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import type { ItemProps } from "../../types";

import { capitalizeName } from "../../utils/format";

import styles from "./Item.module.scss";
import { deleteItem, updateItem } from "../../utils/fetch";

const Item = ({ VALUE, SK, CHECKED }: ItemProps) => {
  const queryClient = useQueryClient();

  const itemId = SK.slice(5);

  const { mutate: deleteItemMutate, isPending: isDeletePending } = useMutation({
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

  const { mutate: updateItemMutate, isPending: isUpdatePending } = useMutation({
    mutationFn: ({ id, checked }: { id: string; checked: boolean }) =>
      updateItem(id, checked),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast.success("Item Updated");
    },
    onError: async (error) => {
      console.error(error);
      toast.error("Unable to add item");
    },
  });

  const handleCheckMutation = (id: string, checked: boolean) => {
    if (isUpdatePending) return;
    updateItemMutate({ id, checked });
  };

  const handleDelete = async (id: string) => {
    if (isDeletePending) return;
    deleteItemMutate(id);
  };

  const textStyles = `${styles.text} ${CHECKED ? styles.checked : ""}`;

  return (
    <li className={styles.li}>
      <div
        className={textStyles}
        onClick={() => handleCheckMutation(itemId, !CHECKED)}
      >
        {capitalizeName(VALUE)}
      </div>

      <button
        onClick={() => handleDelete(itemId)}
        className={styles.button}
        disabled={isUpdatePending || isDeletePending}
      >
        <FaXmark className={styles.icon} />
      </button>
    </li>
  );
};

export default Item;
