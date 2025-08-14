import React, { useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  signIn,
  signUp,
  confirmSignUp,
  getCurrentUser,
  signOut,
} from "aws-amplify/auth";

import { Amplify } from "aws-amplify";

import type { NodeProps } from "../types";

type AuthContextType = {
  auth: object | {};
  setAuth: React.Dispatch<React.SetStateAction<object>>;
  login: any;
  register: any;
  confirm: any;
  getUser: any;
  logout: any;
};

const initialAuthState = {
  auth: {},
  setAuth: () => {},
  login: () => {},
  register: () => {},
  confirm: () => {},
  getUser: () => {},
  logout: () => {},
};

// ENV
const env = import.meta.env;
const poolId = env.VITE_USER_POOL_ID || "";
const clientId = env.VITE_USER_POOL_CLIENT_ID || "";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: poolId,
      userPoolClientId: clientId,
    },
  },
});

const AuthContext = createContext<AuthContextType>(initialAuthState);

const AuthContextProvider = ({ children }: NodeProps) => {
  const [auth, setAuth] = useState<object>({});

  // const navigate = useNavigate();

  const login = async (username: string, password: string) => {
    const result = await signIn({
      username,
      password,
    });
    console.log(result);
    return result;
  };

  const register = async (
    email: string,
    password: string,
    given_name: string,
    family_name: string
  ) => {
    const { isSignUpComplete, userId, nextStep } = await signUp({
      username: email,
      password: password,
      options: {
        userAttributes: {
          email,
          given_name,
          family_name,
        },
      },
    });
    console.log(isSignUpComplete, userId, nextStep);
    return { isSignUpComplete, userId, nextStep };
  };

  const confirm = async (email: string, code: string) => {
    const { isSignUpComplete, nextStep } = await confirmSignUp({
      username: email,
      confirmationCode: code,
    });

    console.log(isSignUpComplete, nextStep);
    return { isSignUpComplete, nextStep };
  };

  const getUser = async () => {
    const { username, userId, signInDetails } = await getCurrentUser();
    console.log(username, userId, signInDetails);
    return { username, userId, signInDetails };
  };

  const logout = async () => {
    await signOut();
  };

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, login, register, confirm, getUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

export const useAuthContext = () => useContext(AuthContext);
