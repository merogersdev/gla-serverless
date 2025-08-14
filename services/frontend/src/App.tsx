import { Outlet } from "react-router-dom";

import Header from "./components/header/Header";
import Container from "./components/container/Container";
import Main from "./components/main/Main";

const App = () => {
  return (
    <>
      <Header title="GLA Serverless" />
      <Main>
        <Container>
          <Outlet />
        </Container>
      </Main>
    </>
  );
};

export default App;
