import {
  signIn,
  signUp,
  confirmSignUp,
  getCurrentUser,
  signOut,
  fetchUserAttributes,
  fetchAuthSession,
  signInWithRedirect,
} from "@aws-amplify/auth";

import { Amplify } from "aws-amplify";

// ENV
const env = import.meta.env;
const poolId = env.VITE_USER_POOL_ID || "";
const clientId = env.VITE_USER_POOL_CLIENT_ID || "";
const domain = env.VITE_USER_POOL_DOMAIN || "";
const baseUrl = env.VITE_BASE_URL || "";

Amplify.configure({
  Auth: {
    Cognito: {
      signUpVerificationMethod: "code",
      userAttributes: {
        email: {
          required: true,
        },
      },
      allowGuestAccess: true,
      loginWith: {
        email: true,
        oauth: {
          domain,
          providers: ["Google"],
          redirectSignIn: [`${baseUrl}/login`],
          redirectSignOut: [`${baseUrl}/login`],
          responseType: "code",
          scopes: [
            "openid",
            "email",
            "profile",
            "aws.cognito.signin.user.admin",
          ],
        },
      },
      userPoolId: poolId,
      userPoolClientId: clientId,
      identityPoolId: "",
    },
  },
});

export const login = async (username: string, password: string) => {
  const result = await signIn({
    username,
    password,
  });

  if (!result) throw new Error("Cannot log in");

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

  return { isSignUpComplete, userId, nextStep };
};

export const confirm = async (email: string, code: string) => {
  const { isSignUpComplete, nextStep } = await confirmSignUp({
    username: email,
    confirmationCode: code,
  });
  return { isSignUpComplete, nextStep };
};

export const getUser = async () => {
  try {
    const { username, userId, signInDetails } = await getCurrentUser();

    return { username, userId, signInDetails };
  } catch (error) {
    return null;
  }
};

export const logout = async () => {
  await signOut();
};

export const getUserDetails = async () => {
  try {
    const result = await fetchUserAttributes();
    return result;
  } catch (error) {
    return null;
  }
};

export const getToken = async () => {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();
  return token;
};

export const loginWithGoogle = () => {
  signInWithRedirect({
    provider: "Google",
  });
};
