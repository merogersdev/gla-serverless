import { useAuthContext } from "../context/auth";

export default function HomePage() {
  const { login, register, confirm, getUser, logout } = useAuthContext();
  return (
    <div>
      <button
        onClick={() => login("michelleevarogers@gmail.com", "Abc12345678")}
      >
        Sign in
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
        Sign Up
      </button>
      <button onClick={() => confirm("michelleevarogers@gmail.com", "444663")}>
        Confirm
      </button>
      <button onClick={() => getUser()}>Get User</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}
