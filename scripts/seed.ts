import "dotenv/config";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

const BASE_URL = process.env.VITE_CRUDCRUD_URL;
if (!BASE_URL) {
  throw new Error("Please set VITE_CRUDCRUD_URL in your .env file.");
}

if (!process.env.VITE_MOCK_USERNAME) {
  throw new Error("Please set VITE_MOCK_USERNAME in your .env file.");
}
if (!process.env.VITE_MOCK_PASSWORD) {
  throw new Error("Please set VITE_MOCK_PASSWORD in your .env file.");
}
const userUsername = process.env.VITE_MOCK_USERNAME;
const userPassword = process.env.VITE_MOCK_PASSWORD;

async function collectionHasDocuments(collectionName: string): Promise<boolean> {
  const url = `${BASE_URL}/${collectionName}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return false;
    const data = await res.json();
    if (!Array.isArray(data)) return false;
    return data.length > 0;
  } catch (err) {
    console.error(`Error checking documents in "${collectionName}":`, err);
    return false;
  }
}

async function anythingExists(): Promise<boolean> {
  const checks = [
    await collectionHasDocuments("users"),
    await collectionHasDocuments("bookings"),
    await collectionHasDocuments("courts"),
    await collectionHasDocuments("tickets"),
  ];
  return checks.some((c) => c === true);
}

async function hashPassword(plainText: string): Promise<string> {
  return bcrypt.hash(plainText, 10);
}

async function seedUsers() {
  const hashedUser = await hashPassword(userPassword);
  const mockUser = {
    email: userUsername,
    password: hashedUser,
    name: "MockUser",
    role: "user",
  };

  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mockUser),
  });
  if (res.ok) {
    console.log("Created mock user:", await res.json());
  } else {
    console.error("Failed to create mock user:", mockUser, await res.text());
  }
}

async function seedBookings() {
  const mockBookings = [
    {
      userEmail: userUsername,
      court: "Bane 1",
      date: "2025-03-01",
      time: "10:00",
      players: 2,
    },
    {
      userEmail: userUsername,
      court: "Bane 2",
      date: "2025-03-02",
      time: "12:00",
      players: 4,
    },
  ];

  for (const booking of mockBookings) {
    const res = await fetch(`${BASE_URL}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    });
    if (res.ok) {
      console.log("Created booking:", await res.json());
    } else {
      console.error("Failed to create booking:", booking, await res.text());
    }
  }
}

async function seedCourts() {
  const courts = [
    { name: "Court #1", courtSize: 2 },
    { name: "Court #2", courtSize: 2 },
    { name: "Court #3", courtSize: 2 },
    { name: "Court #4", courtSize: 4 },
    { name: "Court #5", courtSize: 4 },
    { name: "Court #6", courtSize: 2 }
  ];
  for (const court of courts) {
    const res = await fetch(`${BASE_URL}/courts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(court),
    });
    if (res.ok) {
      console.log("Created court:", await res.json());
    } else {
      console.error("Failed to create court:", court, await res.text());
    }
  }
}

async function seedTickets() {
  const mockTicket = {
    userEmail: userUsername,
    subject: "Mock user test ticket",
    message: "Hello from the mock user. This is a test ticket.",
    status: "open",
    createdAt: new Date().toISOString(),
  };

  const res = await fetch(`${BASE_URL}/tickets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mockTicket),
  });
  if (res.ok) {
    console.log("Created mock ticket:", await res.json());
  } else {
    console.error("Failed to create mock ticket:", mockTicket, await res.text());
  }
}

async function main() {
  const exist = await anythingExists();
  if (exist) {
    console.log("Endpoints are populated. No actions required.");
    return;
  }

  console.log("No documents in users/bookings/courts/tickets. Seeding data now...");

  console.log(`Creating mock user: "${userUsername}"...`);
  await seedUsers();

  console.log("Creating mock bookings...");
  await seedBookings();

  console.log("Creating courts...");
  await seedCourts();

  console.log("Creating mock support ticket...");
  await seedTickets();

  console.log("Seeding script complete!");
}

main().catch(console.error);