import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import zxcvbn from "zxcvbn";
import API from "../api/axios";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const getPasswordStrength = () => {
    return zxcvbn(password).score;
  };

  const getStrengthLabel = () => {
    return ["Too weak", "Weak", "Okay", "Good", "Strong"][getPasswordStrength()];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      return toast.error("All fields are required.");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    if (getPasswordStrength() < 3) {
      return toast.error("Password is too weak. Please choose a stronger password.");
    }

    try {
      const res = await API.post(`/auth/reset-password/${token}`, { password });
      toast.success(res.data.message || "Password reset successful");
      navigate("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">Reset Password</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter new password"
            required
          />
        </div>

        {/* ✅ Password strength appears only if password is typed */}
        {password && (
          <p
            className={`text-sm mb-4 ${
              getPasswordStrength() < 3 ? "text-red-500" : "text-green-600"
            }`}
          >
            Password Strength: {getStrengthLabel()}
          </p>
        )}

        <div className="mb-6">
          <label className="block mb-1 font-medium">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm your password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
