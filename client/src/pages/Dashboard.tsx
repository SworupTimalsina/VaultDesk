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

interface Post {
  _id: string;
  text: string;
  image?: string;
  createdAt: string;
  user: {
    name: string;
    profileImage?: string;
  };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [unlockedSocialPage, setUnlockedSocialPage] = useState(true); // Feed shown by default
  const [showSubscribeOverlay, setShowSubscribeOverlay] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Unauthorized. Please login.");
      navigate("/");
      return;
    }

    try {
      const base64Payload = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(base64Payload)) as DecodedToken;

      if (decodedPayload.exp * 1000 < Date.now()) {
        toast.error("Token expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/");
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
      navigate("/");
    }
  };

  const fetchAllPosts = async () => {
    try {
      const res = await API.get("/posts/all");
      setPosts(res.data);
    } catch {
      toast.error("Failed to load posts");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [navigate]);

  useEffect(() => {
    if (unlockedSocialPage) fetchAllPosts();
  }, [unlockedSocialPage]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleSubscribe = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token || !user) {
      toast.error("Please log in first");
      return;
    }

    const response = await API.post(
      "/payment/initiate",
      {
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const { payment_url } = response.data;

    // ✅ Redirect user to Khalti Web Checkout
    window.location.href = payment_url;
  } catch (error) {
    toast.error("Failed to initiate Khalti payment");
    console.error("Subscribe error:", error);
  }
};


  const handleAddPost = () => {
    if (!subscribed) {
      setShowSubscribeOverlay(true);
      return;
    }
    navigate("/myposts");
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* 🔝 Profile Header */}
      <div className="max-w-2xl mx-auto bg-white p-4 rounded shadow flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <img
  src={
    user.profileImage
      ? `https://localhost:3000/uploads/${user.profileImage}` // use HTTPS here
      : "/default-avatar.png"
  }
  alt="Profile"
  className="w-24 h-24 mx-auto mb-4 rounded-full border"
/>
          <div>
            <p className="font-semibold text-gray-700">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowProfile(true)}
            className="text-sm px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            View Profile
          </button>
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* 📰 Feed */}
      {unlockedSocialPage && (
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-blue-700">VaultDesk Feed</h2>
            <button
              onClick={handleAddPost}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Post
            </button>
          </div>

          {posts.length === 0 ? (
            <p className="text-gray-500 text-center">No posts yet.</p>
          ) : (
            posts.map((post) => (
              <div
                key={post._id}
                className="bg-white p-4 rounded shadow mb-4 animate-fade-in"
              >
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={
                      post.user.profileImage
                        ? `https://localhost:3000/uploads/${post.user.profileImage}`
                        : "/default-avatar.png"
                    }
                    alt="User"
                    className="w-10 h-10 rounded-full border"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {post.user.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="text-gray-800 whitespace-pre-line mb-2">
                  {post.text}
                </p>
                {post.image && (
                  <img
                    src={`https://localhost:3000/uploads/${post.image}`}
                    alt="Post"
                    className="w-full max-h-80 object-cover rounded"
                  />
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* 👤 Edit Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md relative shadow-lg">
            <button
              onClick={() => setShowProfile(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold text-center mb-4">
              Your Profile
            </h2>
            {editing ? (
              <EditProfile
                user={user}
                onUpdated={() => {
                  setEditing(false);
                  fetchUser();
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
                <p className="text-center text-gray-600">
                  <strong>Email:</strong> {user.email}
                </p>
                <p className="text-center text-gray-600">
                  <strong>Phone:</strong> {user.phone}
                </p>
                <div className="text-center mt-4 flex justify-center gap-3">
                  <button
                    onClick={() => setEditing(true)}
                    className="bg-blue-600 text-white py-1 px-4 rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 🔒 Subscribe Overlay */}
      {showSubscribeOverlay && !subscribed && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-blue-700 mb-6">Subscribe to Add Posts</h1>
          <p className="mb-4 text-gray-600 max-w-md text-center px-4">
            Posting is a premium feature. Unlock pro features to share updates and connect with others.
          </p>
          <button
            onClick={handleSubscribe}
            className="bg-green-600 text-white py-3 px-8 rounded hover:bg-green-700 transition text-lg"
          >
            Subscribe Now
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
