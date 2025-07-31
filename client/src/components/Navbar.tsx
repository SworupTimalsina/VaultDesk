import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center px-6">
        <Link to="/dasboard" className="text-2xl font-bold text-blue-700">
          VaultDesk
        </Link>
        <div className="space-x-6">
         
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
