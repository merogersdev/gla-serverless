import { Outlet } from "react-router-dom";

import Header from "./components/Header/Header";
import Container from "./components/Container/Container";
import Main from "./components/Main/Main";

import { useAppSelector } from "./app/hooks";

const App = () => {
  const { value } = useAppSelector((state) => state.theme);

  return (
    <div className={`${value}-theme`}>
      <Header title="GLA Serverless" />
      <Main>
        <Container>
          <Outlet />
        </Container>
      </Main>
    </div>
  );
};

export default App;
