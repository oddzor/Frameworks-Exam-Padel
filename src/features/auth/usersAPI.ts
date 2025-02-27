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

export async function getUser(userId: string): Promise<User> {
  const response = await fetch(`${USERS_ENDPOINT}/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch that user");
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

export async function updateUser(
  userId: string,
  updatedData: Partial<User>
): Promise<User> {
  const response = await fetch(`${USERS_ENDPOINT}/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });
  if (!response.ok) {
    throw new Error("Failed to update user");
  }
  return { ...(updatedData as User), _id: userId };
}

export async function deleteUser(userId: string): Promise<string> {
  const response = await fetch(`${USERS_ENDPOINT}/${userId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete user");
  }
  return userId;
}