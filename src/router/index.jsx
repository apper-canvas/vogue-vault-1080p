import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import Root from "@/layouts/Root";
import { getRouteConfig } from "./route.utils";
import Layout from "@/components/organisms/Layout";

// Lazy loaded components
const HomePage = lazy(() => import("@/components/pages/HomePage"));
const CategoryPage = lazy(() => import("@/components/pages/CategoryPage"));
const ProductDetailPage = lazy(() => import("@/components/pages/ProductDetailPage"));
const CartPage = lazy(() => import("@/components/pages/CartPage"));
const CheckoutPage = lazy(() => import("@/components/pages/CheckoutPage"));
const WishlistPage = lazy(() => import("@/components/pages/WishlistPage"));
const LoginPage = lazy(() => import("@/components/pages/LoginPage"));
const SignupPage = lazy(() => import("@/components/pages/SignupPage"));
const RegisterPage = lazy(() => import("@/components/pages/RegisterPage"));
const AccountPage = lazy(() => import("@/components/pages/AccountPage"));
const OrderHistoryPage = lazy(() => import("@/components/pages/OrderHistoryPage"));
const ProfilePage = lazy(() => import("@/components/pages/ProfilePage"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));
const Callback = lazy(() => import("@/components/pages/Callback"));
const ErrorPage = lazy(() => import("@/components/pages/ErrorPage"));
const ResetPassword = lazy(() => import("@/components/pages/ResetPassword"));
const PromptPassword = lazy(() => import("@/components/pages/PromptPassword"));

// Loading fallback
const loadingFallback = (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </div>
);

// createRoute helper function
const createRoute = ({
  path,
  index,
  element,
  access,
  children,
  ...meta
}) => {
  // Get config for this route
  let configPath;
  if (index) {
    configPath = "/";
  } else {
    configPath = path.startsWith('/') ? path : `/${path}`;
  }

  const config = getRouteConfig(configPath);
  const finalAccess = access || config?.allow;

  const route = {
    ...(index ? { index: true } : { path }),
    element: element ? <Suspense fallback={loadingFallback}>{element}</Suspense> : element,
    handle: {
      access: finalAccess,
      ...meta,
    },
  };

  if (children && children.length > 0) {
    route.children = children;
  }

  return route;
};

// Main application routes
const mainRoutes = [
  createRoute({
    index: true,
    element: <HomePage />
  }),
  createRoute({
    path: "category/:category",
    element: <CategoryPage />
  }),
  createRoute({
    path: "product/:id", 
    element: <ProductDetailPage />
  }),
  createRoute({
    path: "cart",
    element: <CartPage />
  }),
  createRoute({
    path: "checkout",
    element: <CheckoutPage />
  }),
  createRoute({
    path: "wishlist",
    element: <WishlistPage />
  }),
  createRoute({
    path: "login",
    element: <LoginPage />
  }),
  createRoute({
    path: "signup",
    element: <SignupPage />
  }),
  createRoute({
    path: "register",
    element: <RegisterPage />
  }),
  createRoute({
    path: "account",
    element: <AccountPage />
  }),
  createRoute({
    path: "orders", 
    element: <OrderHistoryPage />
  }),
  createRoute({
    path: "profile",
    element: <ProfilePage />
  }),
  createRoute({
    path: "callback",
    element: <Callback />
  }),
  createRoute({
    path: "error",
    element: <ErrorPage />
  }),
  createRoute({
    path: "reset-password/:appId/:fields",
    element: <ResetPassword />
  }),
  createRoute({
    path: "prompt-password/:appId/:emailAddress/:provider",
    element: <PromptPassword />
  }),
  createRoute({
    path: "*",
    element: <NotFound />
  })
];

// Router configuration
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: mainRoutes
      }
    ]
  }
]);