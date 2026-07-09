import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "?";

  return (
    <header className="px-4 sm:px-8 py-4 border-b border-gray-200 bg-white relative">
      <div className="flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md flex items-center justify-center bg-indigo-600">
            <span className="text-white font-semibold text-xs">S</span>
          </div>
          <span className="font-semibold text-gray-900">ShopWave</span>
        </Link>

        {/* Desktop right side */}
        <div className="hidden sm:flex items-center gap-5">
          {user?.role === "admin" && (
            <Link to="/admin" className="text-sm text-gray-600">
              Admin
            </Link>
          )}
          <Link to="/orders" className="text-sm text-gray-600">
            My Orders
          </Link>
          <Link to="/cart" className="relative text-sm text-gray-900">
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-indigo-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium flex items-center justify-center"
            >
              {initial}
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-10 w-44 bg-white border border-gray-200 rounded-lg shadow-sm py-1.5 z-10">
                <div className="px-3.5 py-2 border-b border-gray-100">
                  <p className="text-sm text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3.5 py-2 text-sm text-red-600"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="sm:hidden flex items-center gap-4">
          <Link to="/cart" className="relative text-sm text-gray-900">
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-indigo-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            className="text-2xl leading-none text-gray-900"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden flex flex-col gap-3 mt-4 pt-4 border-t border-gray-100">
          {user?.role === "admin" && (
            <Link to="/admin" className="text-sm text-gray-600" onClick={() => setMenuOpen(false)}>
              Admin
            </Link>
          )}
          <Link to="/orders" className="text-sm text-gray-600" onClick={() => setMenuOpen(false)}>
            My Orders
          </Link>
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium flex items-center justify-center">
                {initial}
              </div>
              <span className="text-sm text-gray-500">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm px-3.5 py-1.5 rounded-lg border border-gray-200 text-gray-700"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;