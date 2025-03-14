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
const ManageProduct = lazy(() => import("../pages/ManageProduct"));
const CreateProduct = lazy(() => import("../pages/CreateProduct"));
const ManageUser = lazy(() => import("../pages/ManageUser"));
const ManageOrder = lazy(() => import("../pages/ManageOrder"));
const ManageCategory = lazy(() => import("../pages/ManageCategory"));
const ManageReview = lazy(() => import("../pages/ManageReview"));
const ManagePromotion = lazy(() =>
  import("../pages/ManagePromotion").then((module) => ({
    default: module.ManagePromotion,
  }))
);
const CreatePromotion = lazy(() =>
  import("../pages/ManagePromotion").then((module) => ({
    default: module.CreatePromotion,
  }))
);

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
  },
  {
    path: "/admin/users",
    element: <ManageUser />,
    pageTitle: "TEELAB | Quản lý người dùng",
    layoutTitle: "QUẢN LÝ NGƯỜI DÙNG",
    wrapper: AdminLayoutWrapper,
  },
  {
    path: "/admin/orders",
    element: <ManageOrder />,
    pageTitle: "TEELAB | Quản lý đơn hàng",
    layoutTitle: "QUẢN LÝ ĐƠN HÀNG",
    wrapper: AdminLayoutWrapper,
  },
  {
    path: "/admin/products",
    element: <ManageProduct />,
    pageTitle: "TEELAB | Quản lý sản phẩm",
    layoutTitle: "QUẢN LÝ SẢN PHẨM",
    wrapper: AdminLayoutWrapper,
  },
  {
    path: "/admin/products/create",
    element: <CreateProduct />,
    pageTitle: "TEELAB | Thêm sản phẩm",
    layoutTitle: "THÊM MỚI SẢN PHẨM",
    wrapper: AdminLayoutWrapper,
  },
  {
    path: "/admin/categories",
    element: <ManageCategory />,
    pageTitle: "TEELAB | Quản lý danh mục",
    layoutTitle: "QUẢN LÝ DANH MỤC",
    wrapper: AdminLayoutWrapper,
  },
  {
    path: "/admin/reviews",
    element: <ManageReview />,
    pageTitle: "TEELAB | Quản lý đánh giá",
    layoutTitle: "QUẢN LÝ ĐÁNH GIÁ",
    wrapper: AdminLayoutWrapper,
  },
  {
    path: "/admin/promotions",
    element: <ManagePromotion />,
    pageTitle: "TEELAB | Quản lý khuyến mãi",
    layoutTitle: "QUẢN LÝ KHUYẾN MÃI",
    wrapper: AdminLayoutWrapper,
  },
  {
    path: "/admin/promotions/create",
    element: <CreatePromotion />,
    pageTitle: "TEELAB | Thêm khuyến mãi",
    layoutTitle: "THÊM MỚI KHUYẾN MÃI",
    wrapper: AdminLayoutWrapper,
  },
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