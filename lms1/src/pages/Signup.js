import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signup } from "../utils/api";
import AuthForm from "../components/AuthForm";

const Signup = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSignup = async (formData) => {
    try {
      const { data } = await signup(formData);
      setUser(data.user); // Update user state
      localStorage.setItem("token", data.token); // Save token to localStorage
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return <AuthForm title="Signup" onSubmit={handleSignup} isSignup />;
};

export default Signup;