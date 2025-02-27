import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";

export default function HeroSection() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAppSelector(selectAuth);

  function handleBookingClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (!isLoggedIn) {
      e.preventDefault();
      alert("Please register to create a booking.");
      navigate("/login?mode=register");
    } else {
      navigate("/bookings");
    }
  }

  return (
    <section className="py-16 text-white bg-gray-900">
      <div className="container flex flex-col items-center px-4 mx-auto md:flex-row ">
        <div className="md:w-1/2">
          <h1 className="mb-4 text-4xl font-bold">Welcome to Gokstad Padel</h1>
          <p className="mb-6 text-gray-300">
            Sandefjord’s new pride and the most modern padel facility in Vestfold.
          </p>
          <p className="mb-6 text-gray-300"> If you are already a member, log in and/or continue to booking.</p>
          <div className="flex space-x-3">
            <Link to="/login?mode=register">
              <button className="px-5 py-2 text-white bg-blue-500 rounded shadow hover:bg-blue-600">
                Account
              </button>
            </Link>
            <button
              onClick={handleBookingClick}
              className="px-5 py-2 text-blue-500 border border-blue-500 rounded shadow hover:bg-blue-500 hover:text-white"
            >
              Booking
            </button>
          </div>
        </div>
        <div className="flex justify-center mt-8 md:w-1/2 md:mt-0">
          <img
            src="/splash-image.jpg"
            alt="Splash"
            className="h-auto max-w-5xl rounded shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}