import { useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const VerifyResetOtp = () => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/verify-reset-otp", { email, otp });
      toast.success(res.data.message);
      setOtpVerified(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/reset-password", {
        email,
        newPassword,
      });
      toast.success(res.data.message);
      navigate("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Password reset failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>

      {!otpVerified ? (
        <form onSubmit={handleVerifyOtp}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full mb-4 px-4 py-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded"
          >
            Verify OTP
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full mb-4 px-4 py-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded"
          >
            Set New Password
          </button>
        </form>
      )}
    </div>
  );
};

export default VerifyResetOtp;
