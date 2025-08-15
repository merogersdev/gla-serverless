import {
  signIn,
  signUp,
  confirmSignUp,
  getCurrentUser,
  signOut,
} from "aws-amplify/auth";

import { Amplify } from "aws-amplify";

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

export const login = async (username: string, password: string) => {
  const result = await signIn({
    username,
    password,
  });
  console.log(result);
  return result;
};

export const register = async (
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

export const confirm = async (email: string, code: string) => {
  const { isSignUpComplete, nextStep } = await confirmSignUp({
    username: email,
    confirmationCode: code,
  });

  console.log(isSignUpComplete, nextStep);
  return { isSignUpComplete, nextStep };
};

export const getUser = async () => {
  const { username, userId, signInDetails } = await getCurrentUser();
  console.log(username, userId, signInDetails);
  return { username, userId, signInDetails };
};

export const logout = async () => {
  await signOut();
};
