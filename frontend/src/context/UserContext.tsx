import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  role_id: number;
}

interface Author {
  id: string;
  name: string;
  is_verified: boolean;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  author: Author | null;
  setAuthor: React.Dispatch<React.SetStateAction<Author | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

interface UserProviderProps {
  children: React.ReactNode;
}

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
