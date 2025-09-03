import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";

import List from "../components/item/list/List";
import Add from "../components/item/add/Add";
import { MiniContainer } from "../components/container/Container";
import Spinner from "../components/spinner/Spinner";
import { getItems } from "../utils/fetch";
import { useAuthContext } from "../context/Auth";
import { toast } from "react-toastify";

export const Home = () => {
  const { user } = useAuthContext();

  if (!user) return <Navigate to="/login" replace />;

  const {
    isLoading: isItemsLoading,
    error: itemsError,
    data: items,
  } = useQuery({
    queryKey: ["items"],
    queryFn: () => getItems(),
  });

  if (isItemsLoading || !items) return <Spinner />;
  if (itemsError) {
    toast.error(itemsError.message);
  }

  return (
    <MiniContainer>
      <Add />
      <List items={items} message="Yay! No more groceries!" />
    </MiniContainer>
  );
};

export default Home;
