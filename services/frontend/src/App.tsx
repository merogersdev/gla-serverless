import { Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Header from "./components/header/Header";
import Container from "./components/container/Container";
import Main from "./components/main/Main";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Header title="GLA Serverless" />
      <Main>
        <Container>
          <Outlet />
        </Container>
      </Main>
    </QueryClientProvider>
  );
};

export default App;
