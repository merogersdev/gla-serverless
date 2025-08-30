import { useEffect } from "react";
import List from "../components/item/list/List";
import Add from "../components/item/add/Add";
import { MiniContainer } from "../components/container/Container";
import Spinner from "../components/spinner/Spinner";

import { useQuery } from "@tanstack/react-query";
import { getItems } from "../utils/fetch";
import { useAuthContext } from "../context/Auth";
import { getUserDetails } from "../utils/amplify";

export const Home = () => {
  const { setAuth } = useAuthContext();

  const {
    isLoading: isItemsLoading,
    error: itemsError,
    data: items,
  } = useQuery({
    queryKey: ["items"],
    queryFn: () => getItems(),
  });

  useEffect(() => {
    const getAuth = async () => {
      try {
        const user = await getUserDetails();

        setAuth({
          user: {
            email: user.email || "",
            givenName: user.given_name || "",
            familyName: user.family_name || "",
          },
        });
      } catch (error) {}
    };

    return () => {
      getAuth();
    };
  }, []);

  if (isItemsLoading) return <Spinner />;
  if (itemsError) return <div>{itemsError.message}</div>;

  return (
    <MiniContainer>
      <Add />
      <List items={items} message="Yay! No more groceries!" />
    </MiniContainer>
  );
};

export default Home;
