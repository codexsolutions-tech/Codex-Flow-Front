import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import AppRoutes from "./routes/App.Routes.tsx";
import { AlertProvider } from "./components/Alert.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AlertProvider>
      <AppRoutes />
    </AlertProvider>
  </StrictMode>,
);
