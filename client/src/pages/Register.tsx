import { useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import zxcvbn from "zxcvbn";

const Register = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    phone: "",
    profileImage: null as File | null,
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "profileImage" && files) {
      setForm({ ...form, profileImage: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const getPasswordStrength = () => {
    return zxcvbn(form.password).score;
  };

  const getStrengthLabel = () => {
    return ["Too weak", "Weak", "Okay", "Good", "Strong"][getPasswordStrength()];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("password", form.password);
      if (form.profileImage) {
        formData.append("profileImage", form.profileImage);
      }

      const res = await API.post("/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(res.data.message || "Registered successfully");
      localStorage.setItem("userEmail", form.email);
      navigate("/verify-otp");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Create Your Account
        </h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@gmail.com"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="98XXXXXXXX"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Profile Image</label>
          <input
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
          />
        </div>

        <div className="mb-1">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            required
          />
        </div>

        {form.password && (
          <p
            className={`text-sm mb-6 ${
              getPasswordStrength() < 3 ? "text-red-500" : "text-green-600"
            }`}
          >
            Password Strength: {getStrengthLabel()}
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
