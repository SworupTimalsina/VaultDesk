import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

interface User {
  name: string;
  phone: string;
  notifications?: {
    email: boolean;
    sms: boolean;
  };
  profileImage?: string;
}

interface Props {
  user: User;
  onUpdated: () => void;
}

const UserProfile = ({ user, onUpdated }: Props) => {
  const navigate = useNavigate();

  const [name, setName] = useState(user.name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [emailNotify, setEmailNotify] = useState(user.notifications?.email ?? false);
  const [smsNotify, setSmsNotify] = useState(user.notifications?.sms ?? false);
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("notifications[email]", String(emailNotify));
    formData.append("notifications[sms]", String(smsNotify));
    if (image) formData.append("profileImage", image);

    try {
      const token = localStorage.getItem("token");
      await API.put("/user/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile updated!");
      onUpdated(); // Notify parent to refetch
    } catch (err: any) {
      console.error("Update error:", err);
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          className="w-full border mb-4 p-2 rounded"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
          className="w-full border mb-4 p-2 rounded"
        />
        <div className="mb-4 flex gap-4">
          <label>
            <input
              type="checkbox"
              checked={emailNotify}
              onChange={() => setEmailNotify(!emailNotify)}
            />{" "}
            Email Notifications
          </label>
          <label>
            <input
              type="checkbox"
              checked={smsNotify}
              onChange={() => setSmsNotify(!smsNotify)}
            />{" "}
            SMS Notifications
          </label>
        </div>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="mb-4"
        />

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
