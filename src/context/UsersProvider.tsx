import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { SEED_USERS } from "../data/seedUsers";
import type { User, UserInput } from "../types/user";
import { UsersContext } from "./usersContext";

const STORAGE_KEY = "cloud-usuarios:users:v1";

function loadUsers(): User[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_USERS;

    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as User[]) : SEED_USERS;
  } catch {
    return SEED_USERS;
  }
}

interface UsersProviderProps {
  children: ReactNode;
}

export function UsersProvider({ children }: UsersProviderProps) {
  const [users, setUsers] = useState<User[]>(loadUsers);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    } catch {
      // Si el almacenamiento no está disponible, seguimos en memoria.
    }
  }, [users]);

  const createUser = useCallback((input: UserInput): User => {
    const user: User = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      lastActiveAt: null,
    };

    setUsers((current) => [user, ...current]);
    return user;
  }, []);

  const updateUser = useCallback((id: string, input: UserInput): void => {
    setUsers((current) =>
      current.map((user) => (user.id === id ? { ...user, ...input } : user)),
    );
  }, []);

  const deleteUser = useCallback((id: string): void => {
    setUsers((current) => current.filter((user) => user.id !== id));
  }, []);

  const getUser = useCallback(
    (id: string): User | undefined => users.find((user) => user.id === id),
    [users],
  );

  const value = useMemo(
    () => ({ users, createUser, updateUser, deleteUser, getUser }),
    [users, createUser, updateUser, deleteUser, getUser],
  );

  return (
    <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
  );
}
