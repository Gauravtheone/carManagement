import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home"; // Import the Home page
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import AddCar from "./pages/AddCar";
import CarDetails from "./components/CarDetails";
import EditCar from "./components/EditCar";
const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Home Page */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<PrivateRoute />}>
        <Route path="/add-car" element={<AddCar />} />
        <Route path="/car/:id" element={<CarDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/edit-car/:id" element={<EditCar />} /> {/* Edit route */}
        
        </Route>
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
