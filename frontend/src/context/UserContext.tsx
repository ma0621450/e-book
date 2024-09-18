import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  Author,
  Post,
  AuthorProfile,
  UserProviderProps,
  UserContextType,
} from "../interfaces";

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAuthor = localStorage.getItem("author");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }

    if (storedAuthor) {
      try {
        setAuthor(JSON.parse(storedAuthor));
      } catch (error) {
        console.error("Error parsing stored author:", error);
        localStorage.removeItem("author");
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, author, setAuthor }}>
      {children}
    </UserContext.Provider>
  );
};
