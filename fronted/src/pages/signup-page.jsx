import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Loader2, Mail, Lock, User, Ticket, Calendar } from "lucide-react";
import axios from "axios";

const SignupPage = () => {
  const [step, setStep] = useState(0); // 0: Role Selection, 1: Signup Form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "ROLE_ATTENDEE",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole });
    setStep(1);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post("http://localhost:8080/api/v1/auth/signup", formData);
      alert("Account created successfully! Please login.");
      navigate("/login");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Signup failed";
      if (!error.response) {
        alert("Could not connect to server.");
      } else {
        alert(errorMessage);
      }
      console.error("Signup Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white px-4">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-80 bg-yellow-500/10 blur-[120px] rounded-full" />

      <div className="relative z-10 w-full max-w-md p-8 space-y-6 bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
        
        {step === 0 ? (
          /* Step 0: Role Selection */
          <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-yellow-500/10 rounded-xl mb-4 border border-yellow-500/20">
                <UserPlus className="size-8 text-yellow-500" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Choose Account Type</h2>
              <p className="text-gray-400 text-sm mt-1">How do you plan to use VibePass?</p>
            </div>

            <div className="grid gap-4">
              <button
                onClick={() => handleRoleSelect("ROLE_ATTENDEE")}
                className="flex items-center p-4 bg-black/40 border border-white/10 rounded-xl hover:border-yellow-500/50 hover:bg-yellow-500/5 transition-all group"
              >
                <div className="p-2 bg-yellow-500/10 rounded-lg group-hover:bg-yellow-500/20">
                  <Ticket className="size-6 text-yellow-500" />
                </div>
                <div className="ml-4 text-left">
                  <h3 className="font-bold">Attendee</h3>
                  <p className="text-xs text-gray-500">I want to discover and buy tickets</p>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelect("ROLE_ORGANIZER")}
                className="flex items-center p-4 bg-black/40 border border-white/10 rounded-xl hover:border-yellow-500/50 hover:bg-yellow-500/5 transition-all group"
              >
                <div className="p-2 bg-yellow-500/10 rounded-lg group-hover:bg-yellow-500/20">
                  <Calendar className="size-6 text-yellow-500" />
                </div>
                <div className="ml-4 text-left">
                  <h3 className="font-bold">Organizer</h3>
                  <p className="text-xs text-gray-500">I want to create and manage events</p>
                </div>
              </button>
            </div>
          </div>
        ) : (
          /* Step 1: Signup Form */
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-yellow-500/10 rounded-xl mb-4 border border-yellow-500/20">
                <UserPlus className="size-8 text-yellow-500" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Create Account</h2>
              <p className="text-gray-400 text-sm mt-1">
                Signing up as <span className="text-yellow-500 font-semibold">{formData.role.replace("ROLE_", "")}</span>
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4 mt-6">
              <div className="relative">
                <User className="absolute left-3 top-3.5 size-4 text-gray-500" />
                <input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:border-yellow-500 outline-none transition-all"
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-3.5 size-4 text-gray-500" />
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:border-yellow-500 outline-none transition-all"
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3.5 size-4 text-gray-500" />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-lg focus:border-yellow-500 outline-none transition-all"
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-all active:scale-[0.98] flex justify-center mt-4"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : "Create Account"}
              </button>
              
              <button 
                type="button" 
                onClick={() => setStep(0)}
                className="w-full text-xs text-gray-500 hover:text-white transition-colors"
              >
                Change role selection
              </button>
            </form>
          </div>
        )}

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;