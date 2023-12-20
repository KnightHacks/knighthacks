import "@fontsource-variable/inter";

import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import { App } from "./app";

import "./index.css";

ReactDOM.createRoot(document.querySelector("#root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
