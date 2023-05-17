import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { Suspense } from "react";
import { Spin } from "antd";

import store from "./configStore";
import "./GlobalStyle.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Suspense
    fallback={
      <Spin
        size="large"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          maxHeight: "100%",
          minHeight: "100vh",
          maxWidth: "100%",
          minWidth: "100vh",
        }}
      />
    }
  >
    <Provider store={store}>
      <App />
    </Provider>
  </Suspense>
);
