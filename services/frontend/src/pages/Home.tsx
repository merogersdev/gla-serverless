import {
  login,
  register,
  confirm,
  getUser,
  logout,
  getUserDetails,
} from "../utils/amplify";

import { getItems, addItem } from "../utils/fetch";

export default function HomePage() {
  return (
    <div>
      <button
        onClick={() => login("michelleevarogers@gmail.com", "Abc12345678")}
      >
        Login
      </button>
      <button
        onClick={() =>
          register(
            "michelleevarogers@gmail.com",
            "Abc12345678",
            "Michelle",
            "Rogers"
          )
        }
      >
        Register
      </button>
      <button onClick={() => confirm("michelleevarogers@gmail.com", "078768")}>
        Confirm
      </button>
      <button onClick={() => getUser()}>Get User</button>
      <button onClick={() => getUserDetails()}>User Details</button>
      <button onClick={() => getItems()}>Get Items</button>
      <button onClick={() => logout()}>Logout</button>
      <button onClick={() => addItem("salt")}>Add Salt</button>
    </div>
  );
}
