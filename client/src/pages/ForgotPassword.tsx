import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/forgot-password", { email });
      toast.success(res.data.message);
      

      localStorage.setItem("resetEmail", email);

  
      navigate("/verify-reset-otp");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4 text-center">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 px-4 py-2 border rounded"
        />
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded w-full">
          Send OTP
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
