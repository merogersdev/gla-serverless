import { useState, createContext, useContext } from "react";

import type { NodeProps } from "../types";
import type { AuthType, AuthContextType } from "../types";

const initialAuthState = {
  auth: {
    user: null,
  },
  setAuth: () => {},
};

const AuthContext = createContext<AuthContextType>(initialAuthState);

const AuthContextProvider = ({ children }: NodeProps) => {
  const [auth, setAuth] = useState<AuthType | null>(null);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

export const useAuthContext = () => useContext(AuthContext);
