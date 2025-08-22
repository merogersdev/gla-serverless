import { getToken } from "./amplify";

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
  }
};
