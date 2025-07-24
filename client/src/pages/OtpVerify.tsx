import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const OtpVerify = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState(localStorage.getItem("userEmail") || "");
  const navigate = useNavigate();

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to next input
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");

    if (code.length < 6 || !email) {
      return toast.error("Enter full OTP and ensure email is available.");
    }

    try {
      const res = await axios.post("http://localhost:3000/api/auth/verify-otp", {
        email,
        otp: code,
      });

      toast.success(res.data.message);
      navigate("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "OTP verification failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Verify Your Email
        </h2>

        <p className="text-sm text-center mb-4 text-gray-600">
          We sent a 6-digit OTP to <strong>{email}</strong>
        </p>

        <div className="flex justify-between mb-6 gap-2">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              id={`otp-${idx}`}
              type="text"
              value={digit}
              onChange={(e) => handleChange(e.target.value, idx)}
              maxLength={1}
              className="w-12 h-12 text-center text-xl border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition"
        >
          Verify
        </button>

        <p className="mt-4 text-center text-sm text-gray-500">
          Didn't get the code?{" "}
          <button
            type="button"
            className="text-blue-600 hover:underline"
            onClick={() => toast.info("Resend OTP feature coming soon.")}
          >
            Resend
          </button>
        </p>
      </form>
    </div>
  );
};

export default OtpVerify;
