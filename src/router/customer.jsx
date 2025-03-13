import React, { lazy, Suspense } from "react";
import Page from "../components/Layout/Page";
import Loading from "../components/Loading";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// Lazy load components
const LayoutUser = lazy(() => import("../components/Layout/LayoutUser"));
const AuthWrapper = lazy(() => import("../components/Auth/AuthWapper"));
const HomePage = lazy(() => import("../pages/HomePage"));
// const Account = lazy(() => import("../pages/Account"));
const Auth = lazy(() => import("../pages/Auth"));

// Route protection
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  if (!isAuthenticated && !isLoading) return <Navigate to="/auth" replace />;
  return children;
};

const AuthRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  if (isAuthenticated && !isLoading) return <Navigate to="/" replace />;
  return children;
};

// Wrapper components
const CustomerWrapper = ({ children, pageTitle }) => (
  <Suspense fallback={<Loading />}>
    <AuthWrapper>
      <LayoutUser>
        <Page title={pageTitle}>{children}</Page>
      </LayoutUser>
    </AuthWrapper>
  </Suspense>
);

// Routes configuration
const routes = [
  {
    path: "/",
    element: <HomePage />,
    pageTitle: "TEELAB",
  },
  {
    path: "/auth",
    element: (
      <AuthRoute>
        <Auth />
      </AuthRoute>
    ),
    pageTitle: "TEELAB",
  },
//   {
//     path: "/account",
//     element: (
//       <ProtectedRoute>
//         <Account />
//       </ProtectedRoute>
//     ),
//     pageTitle: "TEELAB - Tài Khoản",
//   }
];

const CustomerRoutes = routes.map(({ path, element, pageTitle }) => ({
  path,
  element: <CustomerWrapper pageTitle={pageTitle}>{element}</CustomerWrapper>,
}));

export default CustomerRoutes;