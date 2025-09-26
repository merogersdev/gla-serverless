import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";

import List from "../components/item/list/List";
import Add from "../components/item/add/Add";
import {
  MiniContainer,
  LoadingContainer,
} from "../components/container/Container";
import Spinner from "../components/spinner/Spinner";
import { getItems } from "../utils/fetch";
import { useAuthContext } from "../context/Auth";
import { handleError } from "../utils/error";

export const Home = () => {
  const { user } = useAuthContext();

  if (!user) return <Navigate to="/login" replace />;

  const { isLoading: isItemsLoading, data: items } = useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      try {
        return await getItems();
      } catch (error) {
        handleError(error);
      }
    },
  });

  if (isItemsLoading || !items)
    return (
      <LoadingContainer>
        <Spinner />
      </LoadingContainer>
    );

  return (
    <MiniContainer>
      <Add items={items} />
      <List items={items} message="Yay! No more groceries!" />
    </MiniContainer>
  );
};

export default Home;
