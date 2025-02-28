import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";
import HeaderAccountMenu from "../main/HeaderAccountMenu";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, role } = useAppSelector(selectAuth);

  function handleBookingClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!isLoggedIn) {
      e.preventDefault();
      alert("Please log in or register to create a booking.");
      navigate("/login?mode=register");
    }
  }

  return (
    <header className="py-4 bg-gray-900 text-white">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="text-xl font-bold flex items-center space-x-2">
          <Link to="/">
            <img
              src="/gapadel-logo.png"
              alt="GAPADEL LOGO"
              className="w-10 h-10 rounded shadow-lg"
            />
            <span>Gokstad Padel</span>
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <nav className="space-x-6 flex items-center">
            <Link
              to="/bookings"
              onClick={handleBookingClick}
              className="hover:text-blue-400"
            >
              Booking
            </Link>
            {!isLoggedIn || role !== "admin" ? (
              <Link to="/contact" className="hover:text-blue-400">
                Contact
              </Link>
            ) : null}
            {isLoggedIn && role === "admin" && (
              <Link to="/admin" className="hover:text-blue-400">
                Admin Panel
              </Link>
            )}
            {location.pathname !== "/" && (
              <Link to="/" className="hover:text-blue-400">
                Home
              </Link>
            )}
          </nav>
          <HeaderAccountMenu />
        </div>
      </div>
    </header>
  );
}
