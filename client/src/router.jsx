import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CreateProductPage from "./pages/CreateProductPage";
import EditProductPage from "./pages/EditProductPage";
import { ProtectedLayout, AuthLayout } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";
import CartPage from './pages/CartPage';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage';
import OrdersPage from './pages/OrdersPage';


export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "products",
        element: <ProductsPage />,
      },
      {
        path: '/cart',
        element: <CartPage />,
      },
      {
        path: '/checkout/success',
        element: <CheckoutSuccessPage />,
      },
      // Protected routes - require authentication
      {
        element: <ProtectedLayout />,
        children: [],
      },
      {
        path: '/orders',
        element: <OrdersPage />,
      },

      // Admin routes - require authentication AND admin role
      {
        element: <AdminRoute />,
        children: [
          {
            path: "products/create",
            element: <CreateProductPage />,
          },
          {
            path: "products/edit/:id",
            element: <EditProductPage />,
          },
        ],
      },
      // Auth routes - require the user to NOT be authenticated
      {
        element: <AuthLayout />,
        children: [
          {
            path: "register",
            element: <Register />,
          },
          {
            path: "login",
            element: <Login />,
          },
        ],
      },
    ],
  },
]);