import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Header from "./components/header/Header";
import Container from "./components/container/Container";
import Main from "./components/main/Main";
import { ToastContainer } from "react-toastify";
import { getUserDetails } from "./utils/amplify";

import { useGetUser } from "./hooks/useAuth";

import "react-toastify/dist/ReactToastify.css";

import { useAuthContext } from "./context/Auth";

const App = () => {
  //const { setAuth } = useAuthContext();

  // useEffect(() => {
  //   const getAuth = async () => {
  //     try {
  //       const user = await getUserDetails();
  //       console.log(user);

  //       if (user) {
  //         setAuth({
  //           user: {
  //             email: user.email || "",
  //             givenName: user.given_name || "",
  //             familyName: user.family_name || "",
  //           },
  //         });
  //       }
  //     } catch (error) {}
  //   };

  //   return () => {
  //     getAuth();
  //   };
  // }, []);

  return (
    <>
      <Header title="GLA Serverless" />
      <Main>
        <Container>
          <Outlet />
        </Container>
        <ToastContainer
          position="bottom-center"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Main>
    </>
  );
};

export default App;
