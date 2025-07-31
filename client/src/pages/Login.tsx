import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      toast.success("Login successful");
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg bg-white"
      >
        <h2 className="text-2xl font-semibold m-auto text-primary">
          Login to VaultDesk
        </h2>

        <div className="w-full">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="border border-[#DADADA] rounded w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="w-full">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="border border-[#DADADA] rounded w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="text-right w-full text-sm mb-2">
          <Link
            to="/forgot-password"
            className="text-primary hover:underline"
          >
            Forgot Password?
          </Link>
        </div>


        <button
          type="submit"
          className="bg-primary text-white w-full py-2 rounded-md text-base hover:bg-blue-800 transition"
        >
          Login
        </button>
        <Link
          to="/register"
          className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition font-semibold"
        >
          Register
        </Link>
      </form>
    </div>
  );
};

export default Login;
