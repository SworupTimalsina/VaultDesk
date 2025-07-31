import React, { useState } from "react";
import { toast } from "react-toastify";
import API from "../api/axios";

const EditProfile = ({ user, onUpdated }: { user: any; onUpdated: () => void }) => {
  const [name, setName] = useState(user.name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [emailNotify, setEmailNotify] = useState(user.notifications?.email || false);
  const [smsNotify, setSmsNotify] = useState(user.notifications?.sms || false);
  const [image, setImage] = useState<File | null>(null);
  const [nameError, setNameError] = useState(false);

  const containsHTML = (text: string) => /<[^>]*>/.test(text);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (containsHTML(name)) {
      setNameError(true);
      toast.error("Cannot contain HTML tags.");
      return;
    } else {
      setNameError(false);
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("notifications", JSON.stringify({ email: emailNotify, sms: smsNotify }));
    if (image) formData.append("profileImage", image);

    try {
      const token = localStorage.getItem("token");
      await API.put("/user/update", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Profile updated");
      onUpdated(); // Refresh or close modal
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow max-w-md mx-auto mt-6">
      <h2 className="text-xl font-bold text-center">Edit Profile</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full Name"
        className={`w-full p-2 border rounded ${nameError ? "border-red-500" : ""}`}
      />
      {nameError && <p className="text-red-500 text-sm -mt-3">HTML tags are not allowed.</p>}
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone Number"
        className="w-full p-2 border rounded"
      />
      <div className="flex gap-4 items-center">
        {image && (
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            className="mt-2 w-24 h-24 object-cover rounded-full border"
          />
        )}
      </div>
      <input
        type="file"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        Save Changes
      </button>
    </form>
  );
};

export default EditProfile;
