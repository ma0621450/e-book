import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [author, setAuthor] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedAuthor = localStorage.getItem("author");

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Error parsing stored user:", error);
            }
        }

        if (storedAuthor) {
            try {
                setAuthor(JSON.parse(storedAuthor));
            } catch (error) {
                console.error("Error parsing stored author:", error);
                setAuthor(null);
            }
        } else {
            setAuthor(null);
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, author, setAuthor }}>
            {children}
        </UserContext.Provider>
    );
};
