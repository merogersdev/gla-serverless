import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import App from "./App.tsx";

import AuthContextProvider from "./context/Auth.tsx";

import Home from "./pages/Home.tsx";
import Register from "./pages/Register.tsx";
import Login from "./pages/Login.tsx";

import "./styles/global.scss";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<Home />} />
      <Route index={true} path="/login" element={<Login />} />
      <Route index={true} path="/register" element={<Register />} />
    </Route>
  )
);

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);

  root.render(
    <StrictMode>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </StrictMode>
  );
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file."
  );
}
