import React from "react";
import { LoginFormProps } from "../../types";

const LoginForm: React.FC<LoginFormProps> = ({
  emailOrAdmin,
  password,
  onChange,
  onSubmit,
}) => {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div>
        <label className="block text-sm mb-1">Email</label>
        <input
          type="text"
          name="emailOrAdmin"
          className="w-full border border-gray-500 rounded px-3 py-2 bg-gray-700 text-white"
          placeholder="you@example.com"
          value={emailOrAdmin}
          onChange={onChange}
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Password</label>
        <input
          type="password"
          name="password"
          className="w-full border border-gray-500 rounded px-3 py-2 bg-gray-700 text-white"
          placeholder="••••••••"
          value={password}
          onChange={onChange}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;