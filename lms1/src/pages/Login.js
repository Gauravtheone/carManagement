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
      const result = await login(formData);
      const {message,token} = result.data;
      const {email,name} = result.data.user
console.log(message);
console.log(token);
console.log(email);
console.log(name);
localStorage.setItem("token", JSON.stringify(result.data.token))
      localStorage.setItem("user",JSON.stringify(result.data.user)); // Save token to localStorage 
    setUser(result.data.user)
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return <AuthForm title="Login" onSubmit={handleLogin} />;
};

export default Login;
