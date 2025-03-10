import React, { lazy, Suspense } from "react";
import Page from "../components/Layout/Page";
import Loading from "../components/Loading";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthWrapperAdmin = lazy(() =>
  import("../components/Auth/AuthWrapperAdmin")
);
const LayoutAdmin = lazy(() => import("../components/Layout/LayoutAdmin"));
const LoginAdmin = lazy(() => import("../pages/LoginAdmin"));
const Dashboard = lazy(() => import("../pages/DashBoard"));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticatedAdmin, isLoading } = useSelector(
    (state) => state.auth
  );
  if (!isAuthenticatedAdmin && !isLoading)
    return <Navigate to="/admin" replace />;
  return children;
};

const AuthRoute = ({ children }) => {
  const { isAuthenticatedAdmin, isLoading } = useSelector(
    (state) => state.auth
  );
  if (isAuthenticatedAdmin && !isLoading)
    return <Navigate to="/admin/dashboard" replace />;
  return children;
};

const LoginWrapper = ({ children, pageTitle }) => (
  <Suspense fallback={<Loading />}>
    <AuthWrapperAdmin>
      <Page title={pageTitle}>{children}</Page>
    </AuthWrapperAdmin>
  </Suspense>
);

const AdminLayoutWrapper = ({ children, pageTitle, layoutTitle }) => (
  <Suspense fallback={<Loading />}>
    <AuthWrapperAdmin>
      <Page title={pageTitle}>
        <LayoutAdmin title={layoutTitle}>
          <ProtectedRoute>{children}</ProtectedRoute>
        </LayoutAdmin>
      </Page>
    </AuthWrapperAdmin>
  </Suspense>
);

const routes = [
  {
    path: "/admin",
    element: (
      <AuthRoute>
        <LoginAdmin />
      </AuthRoute>
    ),
    pageTitle: "TEELAB | Đăng Nhập Admin",
    wrapper: LoginWrapper,
  },
  {
    path: "/admin/dashboard",
    element: <Dashboard />,
    pageTitle: "TEELAB | Dashboard",
    layoutTitle: "THÔNG TIN THỐNG KÊ",
    wrapper: AdminLayoutWrapper,
  }
];

const AdminRoutes = routes.map(
  ({ path, element, pageTitle, layoutTitle, wrapper: Wrapper }) => ({
    path,
    element: (
      <Wrapper pageTitle={pageTitle} layoutTitle={layoutTitle}>
        {element}
      </Wrapper>
    ),
  })
);

export default AdminRoutes;