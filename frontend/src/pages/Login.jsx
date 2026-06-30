import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", { email, password });
      login(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-x-hidden bg-[#fafaf8]">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-[#1a1a1a]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md flex items-center justify-center bg-indigo-600">
            <span className="text-white font-semibold text-sm">S</span>
          </div>
          <span className="text-white font-semibold text-lg">ShopWave</span>
        </div>

        <div>
          <p className="text-white text-3xl leading-snug font-light mb-4">
            Everything you need,<br />
            one cart away.
          </p>
          <p className="text-sm text-gray-400">
            Shop smarter, checkout faster.
          </p>
        </div>

        <p className="text-xs text-gray-500">© 2026 ShopWave</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-7 h-7 rounded-md flex items-center justify-center bg-indigo-600">
              <span className="text-white font-semibold text-xs">S</span>
            </div>
            <span className="font-semibold text-gray-900">ShopWave</span>
          </div>

          <h1 className="text-2xl font-medium mb-1 text-gray-900">Welcome back</h1>
          <p className="text-sm mb-8 text-gray-500">Login to continue shopping</p>

          {error && (
            <div className="text-sm px-4 py-3 rounded-lg mb-5 bg-red-50 text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5 text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg outline-none transition border border-gray-200 text-gray-900 bg-white focus:border-indigo-600"
                style={{ fontSize: "16px" }}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5 text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg outline-none transition border border-gray-200 text-gray-900 bg-white focus:border-indigo-600"
                style={{ fontSize: "16px" }}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-medium text-white transition disabled:opacity-50 bg-gray-900"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="text-sm mt-7 text-center text-gray-500">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-indigo-600">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;