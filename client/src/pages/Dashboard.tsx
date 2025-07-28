import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axios";
import EditProfile from "./EditProfile";

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
  const [showProfile, setShowProfile] = useState(false); // ⬅️ toggle profile visibility

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
      {/* 🟢 Show only this button initially */}
      {!showProfile && (
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-700 mb-6">VaultDesk Dashboard</h1>
          <button
            onClick={() => setShowProfile(true)}
            className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition"
          >
            View Profile
          </button>
        </div>
      )}

      {/* 👤 Show Profile Card only after button clicked */}
      {showProfile && (
        <div className="bg-white shadow-md rounded p-8 max-w-md w-full text-center mt-6">
          <h1 className="text-2xl font-bold text-blue-700 mb-4">Your Profile</h1>

          {editing ? (
            <EditProfile
              user={user}
              onUpdated={() => {
                setEditing(false);
                fetchUser(); // Refresh data
              }}
            />
          ) : (
            <>
              <img
                src={
                  user.profileImage
                    ? `https://localhost:3000/uploads/${user.profileImage}`
                    : "/default-avatar.png"
                }
                alt="Profile"
                className="w-24 h-24 mx-auto mb-4 rounded-full border"
              />
              <p className="text-gray-600 mb-1">Email: <span className="font-medium">{user.email}</span></p>
              <p className="text-gray-600 mb-1">Phone: {user.phone}</p>
              <p className="text-gray-500 mb-2 capitalize">Role: {user.role}</p>
              <p className="text-sm text-gray-500 mb-4">
                Notifications:{" "}
                {user.notifications?.email ? "Email " : ""}
                {user.notifications?.sms ? "SMS" : ""}
              </p>

              <div className="flex justify-center gap-4 mt-4">
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
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
