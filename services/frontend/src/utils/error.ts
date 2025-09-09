import { toast } from "react-toastify";

export const handleError = (error: Error | unknown) => {
  if (error instanceof Error) {
    toast.error(error.message);
    console.log(error);
  }
};
