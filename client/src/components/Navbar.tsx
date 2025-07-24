import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center px-6">
        <Link to="/" className="text-2xl font-bold text-blue-700">
          VaultDesk
        </Link>
        <div className="space-x-6">
          <Link
            to="/login"
            className="text-gray-700 hover:text-blue-600 font-medium transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition font-semibold"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
