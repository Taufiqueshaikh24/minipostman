import { createBrowserRouter, Navigate } from "react-router-dom";

// Layouts
import AuthLayout from "../layout/AuthLayout";
import DashboardLayout from "../layout/Dashboardlayout";

// Auth Pages
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";

// Dashboard Pages
import Dashboard from "../pages/Dashborad";

// Components
import ProtectedRoute from "../components/ProtectedRoute";

const router = createBrowserRouter([
  // Auth Routes (public)
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <SignupPage />,
      },
    ],
  },

  // Dashboard Routes (protected)
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      // Add more dashboard routes here
      // {
      //   path: "history",
      //   element: <History />,
      // },
    ],
  },

  // Catch-all redirect
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);

export default router;