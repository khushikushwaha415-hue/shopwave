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
    <div className="min-h-screen flex items-center justify-center bg-[#fafaf8] px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-indigo-600 mb-3">
            <span className="text-white font-semibold text-base">S</span>
          </div>
          <h1 className="text-xl font-medium text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">Login to continue shopping</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
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
        </div>

        <p className="text-sm mt-6 text-center text-gray-500">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-indigo-600">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;