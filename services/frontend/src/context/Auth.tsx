import { createContext, useContext } from "react";

import type { NodeProps } from "../types";
import type { AuthContextType } from "../types";

import { LoadingContainer } from "../components/container/Container";
import Spinner from "../components/spinner/Spinner";
import { useGetUser } from "../hooks/useAuth";

const initialAuthState = {
  user: null,
};

const AuthContext = createContext<AuthContextType>(initialAuthState);

const AuthContextProvider = ({ children }: NodeProps) => {
  // const [auth, setAuth] = useState<AuthType | null>(null);

  const { data: user, isLoading } = useGetUser();

  if (isLoading)
    return (
      <LoadingContainer>
        <Spinner />
      </LoadingContainer>
    );

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export default AuthContextProvider;

export const useAuthContext = () => useContext(AuthContext);
