import { FaXmark } from "react-icons/fa6";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import type { ItemProps } from "../../types";

import { capitalizeName } from "../../utils/format";

import styles from "./Item.module.scss";
import { deleteItem, updateItem } from "../../utils/fetch";

const Item = ({ VALUE, SK, CHECKED, isPending, setIsPending }: ItemProps) => {
  const queryClient = useQueryClient();

  const itemId = SK.slice(5);

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
    onSettled: () => {
      setIsPending(false);
    },
  });

  const updateItemMutation = useMutation({
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
    onSettled: () => {
      setIsPending(false);
    },
  });

  const handleCheckMutation = (id: string, checked: boolean) => {
    if (isPending) return;
    setIsPending(true);
    updateItemMutation.mutate({ id, checked });
  };

  const handleDelete = async (id: string) => {
    if (isPending) return;
    setIsPending(true);
    deleteItemMutation.mutate(id);
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
        disabled={isPending}
      >
        <FaXmark className={styles.icon} />
      </button>
    </li>
  );
};

export default Item;
