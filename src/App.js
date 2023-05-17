import { React, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRouteHome from "./Routes/protectedRouteHome";
import ProtectedRouteLogin from "./Routes/protectedRouteLogin";
const Login = lazy(() => import("./Pages/login"));
const HomeTemplate = lazy(() =>
  import("./Templates/home-template/home-template")
);
const Users = lazy(() => import("./Pages/users"));
const Articles = lazy(() => import("./Pages/articles"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate to="/login" replace />} />
        <Route element={<ProtectedRouteLogin />}>
          <Route path="login" element={<Login />} />
        </Route>
        <Route element={<ProtectedRouteHome />}>
          <Route element={<HomeTemplate />}>
            <Route path="users" element={<Users />} />
            <Route path="articles" element={<Articles />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
