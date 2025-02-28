import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAuth, loginUser, logout } from "../../features/auth/authSlice";
import BannedModal from "../authentication/BannedModal";

export default function HeaderAccountMenu() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, email } = useAppSelector(selectAuth);

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [loginForm, setLoginForm] = useState({
    emailOrAdmin: "",
    password: "",
  });
  const [showBannedModal, setShowBannedModal] = useState(false);
  const [banReason, setBanReason] = useState("");

  function toggleDropdown() {
    setShowDropdown((prev) => !prev);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  }

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    dispatch(
      loginUser({
        emailOrAdmin: loginForm.emailOrAdmin,
        password: loginForm.password,
      })
    )
      .unwrap()
      .then((payload) => {
        const { role, banned, banReason: reason } = payload;
        if (banned) {
          setBanReason(reason || "No reason provided");
          setShowBannedModal(true);
        } else if (role === "admin") {
          alert("Welcome, Admin!");
          setShowDropdown(false);
          setLoginForm({ emailOrAdmin: "", password: "" });
          navigate("/admin");
        } else {
          alert("Welcome!");
          setShowDropdown(false);
          setLoginForm({ emailOrAdmin: "", password: "" });
          navigate("/bookings");
        }
      })
      .catch((err) => {
        alert(err);
      });
  }

  function handleLogout() {
    dispatch(logout());
    setShowDropdown(false);
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="focus:outline-none">
        <FaUserCircle className="text-2xl hover:text-blue-400 fill-gray-300" />
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-700 text-white rounded shadow-lg p-4 z-50">
          {!isLoggedIn ? (
            <>
              <form onSubmit={handleLoginSubmit} className="space-y-2">
                <h3 className="text-sm font-semibold mb-2">Login</h3>
                <input
                  type="text"
                  name="emailOrAdmin"
                  placeholder="you@example.com"
                  value={loginForm.emailOrAdmin}
                  onChange={handleChange}
                  className="w-full border border-gray-500 rounded px-3 py-2 bg-gray-700 text-white"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={loginForm.password}
                  onChange={handleChange}
                  className="w-full border border-gray-500 rounded px-3 py-2 bg-gray-700 text-white"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 w-full"
                >
                  Login
                </button>
              </form>
              <hr className="my-2 border-gray-600" />
              <p className="text-sm mb-1">Don't have an account?</p>
              <Link
                to="/login?mode=register"
                className="text-blue-400 hover:underline text-sm"
              >
                Register here
              </Link>
            </>
          ) : (
            <>
              <p className="text-sm mb-2">Hi, {email}</p>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
              >
                Log Out
              </button>
            </>
          )}
        </div>
      )}

      {showBannedModal && (
        <BannedModal
          reason={banReason}
          onClose={() => setShowBannedModal(false)}
        />
      )}
    </div>
  );
}
