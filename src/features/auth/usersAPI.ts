import { User } from "../../types.d";

const BASE_URL = import.meta.env.VITE_CRUDCRUD_URL;
if (!BASE_URL) {
  throw new Error("Please set VITE_CRUDCRUD_URL in your .env file.");
}

const USERS_ENDPOINT = `${BASE_URL}/users`;

export async function getAllUsers(): Promise<User[]> {
  const response = await fetch(USERS_ENDPOINT);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
}

export async function registerUser(userData: Omit<User, "_id">): Promise<User> {
  const response = await fetch(USERS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    throw new Error("Failed to register user");
  }
  return response.json();
}

