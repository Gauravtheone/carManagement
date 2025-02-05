import { createContext, useContext, useEffect, useState } from "react";
// import { checkAuth } from "../utils/api"; // Assuming checkAuth verifies token validity
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // const navigate = useNavigate(); // Declare useNavigate outside useEffect

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token"); // Get token from localStorage
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // const userData = await checkAuth(token); // API call to verify token
        console.log(token)
        const userData = localStorage.getItem('user');
        console.log("YELOOOOO")
        console.log(userData)
        setUser(userData); // Set user if authenticated
        // navigate("/dashboard"); // Redirect to dashboard
      } catch (error) {
        console.error("Authentication failed", error);
        localStorage.removeItem("token"); // Remove invalid token
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []); // Add navigate as a dependency

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
