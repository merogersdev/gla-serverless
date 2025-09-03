import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import { login, getUserDetails, logout } from "../utils/amplify";
import { toast } from "react-toastify";

export const useGetUser = () => {
  const { data, isError, isFetching, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUserDetails(),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  if (isError) return { data: null, isLoading };
  return { data, isFetching, isLoading };
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      const response = await login(username, password);
      return response;
    },
    onSuccess: async () => {
      const user = await getUserDetails();
      queryClient.setQueryData(["user"], user);
      toast.success("Login successful");
    },
    onError: async (error) => {
      toast.error(`${error.message}`);
      //console.error(error);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      queryClient.setQueryData(["user"], null);
    },
  });
};
