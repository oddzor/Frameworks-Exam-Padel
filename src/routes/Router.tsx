import { ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectAuth } from "../features/auth/authSlice";
import BookingsPage from "../pages/BookingsPage";
import AdminPage from "../pages/AdminPage";
import Login from "../pages/LoginPage";
import ContactPage from "../pages/ContactPage";
import LandingPage from "../pages/LandingPage";

interface PrivateRouteProps {
  children: ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const { isLoggedIn, banned } = useAppSelector(selectAuth);
  if (!isLoggedIn) return <Navigate to="/login" />;
  if (banned) return <Navigate to="/contact" />;
  return <>{children}</>;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route
        path="/bookings"
        element={
          <PrivateRoute>
            <BookingsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}