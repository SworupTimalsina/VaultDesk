import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface DecodedToken {
  userId: string;
  role: string;
  email?: string;
  exp: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Unauthorized. Please login.");
      navigate("/login");
      return;
    }

    try {
      const base64Payload = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(base64Payload)) as DecodedToken;

      // Optional: check token expiration
      if (decodedPayload.exp * 1000 < Date.now()) {
        toast.error("Token expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setEmail(decodedPayload.email || "User");
      setRole(decodedPayload.role);
    } catch (err) {
      console.error("Manual JWT decode failed:", err);
      toast.error("Session invalid. Please login.");
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">Welcome to VaultDesk</h1>
        <p className="text-gray-600 mb-2">
          Logged in as: <span className="font-medium">{email}</span>
        </p>
        <p className="text-gray-500 mb-6">
          Role: <span className="capitalize">{role}</span>
        </p>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
