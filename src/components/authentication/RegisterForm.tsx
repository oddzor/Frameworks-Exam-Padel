import React from "react";
import { RegisterFormProps } from "../../types";

const RegisterForm: React.FC<RegisterFormProps> = ({
  email,
  password,
  onChange,
  onSubmit,
}) => {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div>
        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          name="email"
          className="w-full border border-gray-500 bg-gray-700 rounded px-3 py-2"
          placeholder="you@example.com"
          value={email}
          onChange={onChange}
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Password</label>
        <input
          type="password"
          name="password"
          className="w-full border border-gray-500 bg-gray-700 rounded px-3 py-2"
          placeholder="••••••••"
          value={password}
          onChange={onChange}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Register
      </button>
    </form>
  );
};

export default RegisterForm;
