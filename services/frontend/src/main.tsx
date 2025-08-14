import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import App from "./App.tsx";
import { AuthProvider } from "react-oidc-context";
import AuthContextProvider from "./context/auth.tsx";

const cognitoAuthConfig = {
  authority:
    "https://cognito-idp.ca-central-1.amazonaws.com/ca-central-1_kfEngSk0R",
  client_id: "25mb53t9brr415r459jfsd88i9",
  redirect_uri: "http://localhost:5173",
  response_type: "code",
  scope: "aws.cognito.signin.user.admin email openid phone profile",
};

import HomePage from "./pages/Home.tsx";
import RegisterPage from "./pages/Register.tsx";
import LoginPage from "./pages/Login.tsx";

import "./styles/global.scss";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomePage />} />
      <Route index={true} path="/login" element={<LoginPage />} />
      <Route index={true} path="/register" element={<RegisterPage />} />
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
