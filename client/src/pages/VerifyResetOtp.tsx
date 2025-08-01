import { useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import zxcvbn from "zxcvbn";

const VerifyResetOtp = () => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");

  const getPasswordStrength = () => {
    return zxcvbn(newPassword).score;
  };

  const getStrengthLabel = () => {
    return ["Too weak", "Weak", "Okay", "Good", "Strong"][getPasswordStrength()];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpVerified) {
      try {
        const res = await API.post("/auth/verify-reset-otp", { email, otp });
        toast.success(res.data.message);
        setOtpVerified(true);
      } catch (err: any) {
        toast.error(err.response?.data?.message || "OTP verification failed");
      }
    } else {
      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      if (getPasswordStrength() < 3) {
        toast.error("Password is too weak. Please use a stronger one.");
        return;
      }

      try {
        const res = await API.post("/auth/reset-password", {
          email,
          newPassword,
        });
        toast.success(res.data.message);
        navigate("/");
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Password reset failed");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">
        {otpVerified ? "Reset Password" : "Verify OTP"}
      </h2>

      <form onSubmit={handleSubmit}>
        {!otpVerified ? (
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full mb-4 px-4 py-2 border rounded"
          />
        ) : (
          <>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full mb-3 px-4 py-2 border rounded"
            />

            {/* ✅ Password Strength Meter */}
            <p
              className={`text-sm mb-2 ${
                getPasswordStrength() < 3 ? "text-red-500" : "text-green-600"
              }`}
            >
              Password Strength: {getStrengthLabel()}
            </p>

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full mb-4 px-4 py-2 border rounded"
            />
          </>
        )}

        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition"
        >
          {otpVerified ? "Reset Password" : "Verify OTP"}
        </button>
      </form>
    </div>
  );
};

export default VerifyResetOtp;
