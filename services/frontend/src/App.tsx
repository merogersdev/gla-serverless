import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Header from "./components/header/Header";
import Container from "./components/container/Container";
import Main from "./components/main/Main";

import "react-toastify/dist/ReactToastify.css";

const App = () => {
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
