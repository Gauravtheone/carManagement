import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login } from "../utils/api";
import AuthForm from "../components/AuthForm";

const Login = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async (formData) => {
    try {
      const { data } = await login(formData);
      setUser(data.user); // Update user state
      localStorage.setItem("token", data.token); // Save token to localStorage
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return <AuthForm title="Login" onSubmit={handleLogin} />;
};

export default Login;