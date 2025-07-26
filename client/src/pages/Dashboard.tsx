import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axios";
import EditProfile from "./EditProfile"; // <-- import your EditProfile component

interface DecodedToken {
  userId: string;
  role: string;
  email?: string;
  exp: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Unauthorized. Please login.");
      navigate("/login");
      return;
    }

    try {
      const base64Payload = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(base64Payload)) as DecodedToken;

      if (decodedPayload.exp * 1000 < Date.now()) {
        toast.error("Token expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const res = await API.get(`/user/${decodedPayload.userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("JWT decode failed:", err);
      toast.error("Session invalid. Please login.");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      {editing ? (
        <EditProfile
          user={user}
          onUpdated={() => {
            setEditing(false);
            fetchUser(); // refresh user after update
          }}
        />
      ) : (
        <div className="bg-white shadow-md rounded p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-blue-700 mb-4">Welcome to VaultDesk</h1>

          <img
            src={
              user.profileImage
                ? `http://localhost:3000/uploads/${user.profileImage}`
                : "/default-avatar.png"
            }
            alt="Profile"
            className="w-24 h-24 mx-auto mb-4 rounded-full border"
          />

          <p className="text-gray-600 mb-1">
            Email: <span className="font-medium">{user.email}</span>
          </p>
          <p className="text-gray-600 mb-1">Phone: {user.phone}</p>
          <p className="text-gray-500 mb-4 capitalize">Role: {user.role}</p>

          <p className="text-sm text-gray-500 mb-4">
            Notifications:{" "}
            {user.notifications?.email ? "Email" : ""}{" "}
            {user.notifications?.sms ? "SMS" : ""}
          </p>

          <div className="flex gap-4 justify-center mt-4">
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
