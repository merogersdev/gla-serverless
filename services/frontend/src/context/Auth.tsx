import { createContext, useContext, useState, useEffect } from "react";

import type { UserAttributeKey } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";

import { getUserDetails } from "../utils/amplify";
import { toast } from "react-toastify";

import type { NodeProps, AuthContextType } from "../types";

const initialAuthState = {
  isPending: false,
  user: null,
  setUser: () => {},
};

const AuthContext = createContext<AuthContextType>(initialAuthState);

const AuthContextProvider = ({ children }: NodeProps) => {
  const [user, setUser] = useState<Partial<
    Record<UserAttributeKey, string>
  > | null>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        // case "signedIn":
        //   toast.success("Sign in with Email Successful");
        //   break;
        // case "signedOut":
        //   toast.success("Sign out successful");
        //   break;
        case "signInWithRedirect":
          getUser();
          break;
        case "signInWithRedirect_failure":
          toast.error("Failed to sign in with Google");
          break;
      }
    });

    getUser();
    return unsubscribe;
  }, []);

  const getUser = async () => {
    setIsPending(true);
    try {
      const currentUserAttributes = await getUserDetails();
      setUser(currentUserAttributes);
      setIsPending(false);
    } catch (error) {
      setIsPending(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isPending }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

export const useAuthContext = () => useContext(AuthContext);
