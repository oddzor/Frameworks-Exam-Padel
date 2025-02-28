import type { Court } from "../../types.d";

const BASE_URL = import.meta.env.VITE_CRUDCRUD_URL;
if (!BASE_URL) {
  throw new Error("Please set VITE_CRUDCRUD_URL in your .env file.");
}

const COURTS_ENDPOINT = `${BASE_URL}/courts`;

export async function getAllCourts(): Promise<Court[]> {
  const response = await fetch(COURTS_ENDPOINT);
  if (!response.ok) {
    throw new Error("Failed to fetch courts");
  }
  return response.json();
}

export async function createCourt(
  courtData: Omit<Court, "_id">
): Promise<Court> {
  const response = await fetch(COURTS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(courtData),
  });
  if (!response.ok) {
    throw new Error("Failed to create court");
  }
  return response.json();
}

export async function deleteCourt(courtId: string): Promise<string> {
  const response = await fetch(`${COURTS_ENDPOINT}/${courtId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete court");
  }
  return courtId;
}
