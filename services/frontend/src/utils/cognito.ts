import { Amplify } from "aws-amplify";
import { signUp, signIn } from "aws-amplify/auth";

const USER_POOL_ID = import.meta.env.VITE_USER_POOL_ID || "";
const USER_POOL_CLIENT_ID = import.meta.env.VITE_USER_POOL_CLIENT_ID || "";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: USER_POOL_ID,
      userPoolClientId: USER_POOL_CLIENT_ID,
    },
  },
});
