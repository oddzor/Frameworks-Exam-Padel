import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createTicket } from "../features/tickets/ticketsAPI";

export default function ContactPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !message.trim() || !email.trim()) {
      alert("Please fill out all fields.");
      return;
    }
    try {
      const newTicket = {
        userEmail: email,
        subject,
        message,
        status: "open",
        createdAt: new Date().toISOString(),
      };
      await createTicket(newTicket);
      setSubject("");
      setMessage("");
      setEmail("");
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Failed to send support ticket.");
    }
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 flex items-start justify-center">
        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="bg-gray-800 p-6 rounded shadow-md w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-4">Contact Support</h2>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">
                Your Email
              </label>
              <input
                type="email"
                className="border border-gray-500 rounded w-full px-3 py-2 bg-gray-700 text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">
                Subject
              </label>
              <input
                type="text"
                className="border border-gray-500 rounded w-full px-3 py-2 bg-gray-700 text-white"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">
                Message
              </label>
              <textarea
                className="border border-gray-500 rounded w-full px-3 py-2 bg-gray-700 text-white h-24"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </form>
        ) : (
          <div className="bg-gray-800 p-6 rounded shadow-md w-full max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">Ticket Submitted</h2>
            <p className="text-sm mb-4">
              Your support ticket was sent. We'll get back to you soon.
            </p>
            <div className="flex space-x-2 justify-center">
              <button
                onClick={() => setSubmitted(false)}
                className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded"
              >
                Send Another
              </button>
              <Link
                to="/"
                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
