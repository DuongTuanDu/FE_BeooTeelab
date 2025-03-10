import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminRoutes from "./admin";
import NotFound from "../pages/NotFound";

const Router = () => {
  return (
    <Routes>
      {AdminRoutes.map((route, index) => (
        <Route
          key={`admin-${index}`}
          path={route.path}
          element={route.element}
        />
      ))}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;