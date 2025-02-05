import axios from "axios";

// Set default base URL
const API = axios.create({
  baseURL: "https://carmanagement-zui1.onrender.com/api",
  withCredentials: true, // ✅ Ensures cookies are sent with requests
});

// ✅ Automatically attach token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // ✅ Get token from localStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API Functions
export const login = (credentials) => API.post("/auth/login", credentials);
export const signup = (data) => API.post("/auth/signup", data);
export const logout = () => {
  localStorage.removeItem("token"); // ✅ Ensure token is removed on logout
  return API.post("/auth/logout");
};
export const getCarById = (id) => API.get(`/cars/${id}`);
export const getCars = () => API.get("/cars"); // ✅ Now includes token
export const searchCars = (keyword) => API.get(`/cars/search?keyword=${keyword}`);
export const createCar = (carData) => API.post("/cars", carData);
export const updateCar = (id, carData) => API.put(`/cars/${id}`, carData);
export const deleteCar = (id) => API.delete(`/cars/${id}`);
