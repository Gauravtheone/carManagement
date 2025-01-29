import { createContext, useContext, useEffect, useState } from "react";
import { checkAuth } from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token"); // Get token from localStorage
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await checkAuth(token); // Verify token with backend
        setUser(data.user); // Set user state if token is valid
      } catch {
        setUser(null); // Clear user state if token is invalid
        localStorage.removeItem("token"); // Remove invalid token
      } finally {
        setLoading(false); // Stop loading
      }
    };

    verifyUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);