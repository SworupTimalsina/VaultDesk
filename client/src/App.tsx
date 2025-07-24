import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import OtpVerify from "./pages/OtpVerify"; 

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <h1 className="text-3xl font-bold text-center mt-10 text-blue-700">
              VaultDesk Home
            </h1>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/verify-otp" element={<OtpVerify />} />
      </Routes>
    </>
  );
};

export default App;
