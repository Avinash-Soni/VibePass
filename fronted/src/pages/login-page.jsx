import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router"; // 👈 Add useLocation
import { ShieldCheck, Loader2 } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../config.js";


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(""); // 👈 Added local error state
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();


const handleLogin = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError("");

  try {
    // Axios automatically stringifies the body and sets Content-Type to application/json
    const response = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, {
      email,
      password,
    });

    // Axios stores the parsed JSON in 'data'
    const data = response.data;

    // Axios only enters the 'try' block if status is 2xx
    login(data.token);

    const destination = localStorage.getItem("redirectPath") || "/dashboard";
    localStorage.removeItem("redirectPath");

    navigate(destination, { replace: true });
  } catch (err) {
    // Axios errors contain the response object if the server replied with an error code
    const errorMessage = err.response?.data?.message || "Invalid email or password";
    
    if (!err.response) {
      setError("Server is unreachable. Please try again later.");
    } else {
      setError(errorMessage);
    }
    
    console.error("Auth Error:", err);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-900 rounded-2xl border border-white/10 shadow-2xl">
        <div className="flex flex-col items-center">
          <div className="p-3 bg-yellow-500/10 rounded-xl mb-4">
            <ShieldCheck className="size-8 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold">Welcome Back</h2>
          <p className="text-gray-400 text-sm text-center px-4">Enter your credentials to access VibePass</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Email</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full p-3 bg-black border border-white/10 rounded-lg focus:border-yellow-500 outline-none transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-3 bg-black border border-white/10 rounded-lg focus:border-yellow-500 outline-none transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-yellow-500 text-black font-black uppercase tracking-widest rounded-lg hover:bg-yellow-400 transition-all active:scale-[0.98] flex justify-center items-center gap-2"
          >
            {isSubmitting ? <Loader2 className="animate-spin size-5" /> : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-600">
          Don't have an account? <span className="text-yellow-500 cursor-pointer hover:underline" onClick={() => navigate("/signup")}>Create one</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;