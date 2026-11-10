import React from "react";
import ReactDOM from "react-dom/client";
import { InicializarAuth } from "./auth/InicializarAuth";
import AppRouter from "./routes/AppRouter";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <InicializarAuth>
      <AppRouter />
    </InicializarAuth>
  </React.StrictMode>,
);
