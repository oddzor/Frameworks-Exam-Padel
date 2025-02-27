import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { loginUser } from "../features/auth/authSlice";
import { getAllUsers, registerUser } from "../features/auth/usersAPI";
import bcrypt from "bcryptjs";
import { User } from "../types";
import LoginForm from "../components/authentication/LoginForm";
import RegisterForm from "../components/authentication/RegisterForm";
import BannedModal from "../components/authentication/BannedModal";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const modeParam = searchParams.get("mode");
  const [isRegister, setIsRegister] = useState(modeParam === "register");
  const [loginInput, setLoginInput] = useState({ emailOrAdmin: "", password: "" });
  const [registerInput, setRegisterInput] = useState({ email: "", password: "" });
  const [showBannedModal, setShowBannedModal] = useState(false);
  const [banReason, setBanReason] = useState("");

  useEffect(() => {
    if (modeParam === "register") {
      setIsRegister(true);
    }
  }, [modeParam]);

  function handleLoginChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLoginInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleRegisterChange(e: React.ChangeEvent<HTMLInputElement>) {
    setRegisterInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function toggleMode() {
    setIsRegister((prev) => !prev);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isRegister) {
      try {
        if (!registerInput.email || !registerInput.password) {
          alert("Please fill email and password to register.");
          return;
        }
        const allUsers = await getAllUsers();
        const existing = allUsers.find(
          (u) => u.email?.toLowerCase() === registerInput.email.toLowerCase()
        );
        if (existing) {
          alert("Account already exists. Please log in.");
          return;
        }
        const hashedPassword = await bcrypt.hash(registerInput.password, 10);
        const newUser: Omit<User, "_id"> = {
          email: registerInput.email,
          password: hashedPassword,
          name: registerInput.email,
          role: "user",
        };
        const created = await registerUser(newUser);
        alert(`Registered user with email: ${created.email}`);
        setRegisterInput({ email: "", password: "" });
        setIsRegister(false);
      } catch (err) {
        console.error("Register error:", err);
        alert("Error registering. Check console for details.");
      }
    } else {
      try {
        const resultAction = await dispatch(
          loginUser({
            emailOrAdmin: loginInput.emailOrAdmin,
            password: loginInput.password,
          })
        );
        if (loginUser.fulfilled.match(resultAction)) {
          const { role, banned, banReason } = resultAction.payload;
          if (banned) {
            setBanReason(banReason || "No reason provided");
            setShowBannedModal(true);
          } else if (role === "admin") {
            alert("Welcome, Admin!");
            navigate("/admin");
          } else {
            alert("Welcome!");
            navigate("/bookings");
          }
        } else {
          alert(resultAction.payload || "Login error");
        }
      } catch (err) {
        console.error("Login error:", err);
        alert("Error logging in. Check console for details.");
      }
    }
  }

  return (
    <section className="min-h-screen bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4 flex items-center justify-center">
        <div className="bg-gray-800 p-6 rounded shadow-md w-full max-w-md">
          {isRegister ? (
            <h2 className="text-2xl font-bold mb-4">Register</h2>
          ) : (
            <h2 className="text-2xl font-bold mb-4">Login</h2>
          )}

          {isRegister ? (
            <RegisterForm
              email={registerInput.email}
              password={registerInput.password}
              onChange={handleRegisterChange}
              onSubmit={handleSubmit}
            />
          ) : (
            <LoginForm
              emailOrAdmin={loginInput.emailOrAdmin}
              password={loginInput.password}
              onChange={handleLoginChange}
              onSubmit={handleSubmit}
            />
          )}

          <hr className="my-4 border-gray-600" />
          <div className="text-center">
            {isRegister ? (
              <>
                <p className="text-sm">Already have an account?</p>
                <button
                  onClick={toggleMode}
                  className="text-blue-400 hover:underline text-sm"
                >
                  Login here
                </button>
              </>
            ) : (
              <>
                <p className="text-sm">Don't have an account?</p>
                <button
                  onClick={toggleMode}
                  className="text-blue-400 hover:underline text-sm"
                >
                  Register here
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {showBannedModal && (
        <BannedModal reason={banReason} onClose={() => setShowBannedModal(false)} />
      )}
    </section>
  );
}