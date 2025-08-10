
import type { User } from "./types";

// Default users to populate localStorage if it's empty
export const initialUsers: User[] = [
  { id: "user-1", username: "admin", password: "admin", role: "Administrator", status: "active" },
  { id: "user-2", username: "kasir01", password: "kasir01", role: "Kasir", status: "active" },
  { id: "user-3", username: "kasir02", password: "kasir02", role: "Kasir", status: "active" },
];
