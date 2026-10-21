import { createContext } from "react";
import type { User, UserInput } from "../types/user";

export interface UsersContextValue {
  users: User[];
  createUser: (input: UserInput) => User;
  updateUser: (id: string, input: UserInput) => void;
  deleteUser: (id: string) => void;
  getUser: (id: string) => User | undefined;
}

export const UsersContext = createContext<UsersContextValue | undefined>(
  undefined,
);
