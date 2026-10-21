import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "react-oidc-context";
import { cognitoAuthConfig } from "./authConfig";
import { ThemeProvider } from "./context/ThemeProvider";
import { UsersProvider } from "./context/UsersProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider {...cognitoAuthConfig}>
        <UsersProvider>
          <App />
        </UsersProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
