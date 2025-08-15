import React, { useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

import type { NodeProps } from "../types";

type AuthContextType = {
  auth: object | {};
  setAuth: React.Dispatch<React.SetStateAction<object>>;
};

const initialAuthState = {
  auth: {},
  setAuth: () => {},
};

const AuthContext = createContext<AuthContextType>(initialAuthState);

const AuthContextProvider = ({ children }: NodeProps) => {
  const [auth, setAuth] = useState<object>({});

  // const navigate = useNavigate();

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

export const useAuthContext = () => useContext(AuthContext);
