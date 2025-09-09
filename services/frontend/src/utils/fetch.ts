import { getToken } from "./amplify";
import { toast } from "react-toastify";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "";

export const getItems = async () => {
  const token = await getToken();

  try {
    const result = await fetch(`${baseUrl}/items`, {
      method: "GET",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await result.json();
    return data.payload.Items;
  } catch (error) {
    console.error(error);
    toast.error("Could not get items");
  }
};

export const addItem = async (value: string) => {
  const token = await getToken();

  try {
    const result = await fetch(`${baseUrl}/items`, {
      method: "POST",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        value,
      }),
    });

    const data = await result.json();
    return data.payload.Items;
  } catch (error) {
    console.error(error);
    toast.error("Could not add item");
  }
};

export const deleteItem = async (value: string) => {
  const token = await getToken();

  try {
    const result = await fetch(`${baseUrl}/item/${value}`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await result.json();
    return data.payload.Items;
  } catch (error) {
    console.error(error);
    toast.error("Could not delete item");
  }
};

export const addUserProfile = async (givenName: string, familyName: string) => {
  const token = await getToken();

  try {
    const result = await fetch(`${baseUrl}/user`, {
      method: "POST",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        givenName,
        familyName,
      }),
    });

    const data = await result.json();
    return data.payload;
  } catch (error) {
    console.error(error);
    toast.error("Could not add new user profile");
  }
};
