import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../hooks/use-auth.jsx";
import logo from "../attached_assets/bleu_logo1.jpg";
import bgImage from "../attached_assets/BG.webp";

export default function AuthPage() {
  const [, navigate] = useLocation();
  const { loginMutation } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await loginMutation.mutateAsync(formData);
      if (user) {
        navigate("/Dashboard");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex flex-col justify-center items-center bg-gradient-to-b from-[#77B7B7] to-[#B7D5D5] w-full md:w-1/2 p-8">
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Logo" className="w-20 h-20 rounded-full" />
          </div>
          <h1 className="text-2xl font-semibold text-center text-[#77B7B7] mb-2">Welcome Back</h1>
          <p className="text-gray-500 text-center text-sm mb-8">Please Enter Your Details To Log In.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-600 text-sm mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#77B7B7]"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#77B7B7]"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-[#77B7B7] focus:ring-[#77B7B7]"
                />
                <span className="ml-2 text-sm text-gray-600">Remember Me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-[#77B7B7] text-white py-3 rounded-lg hover:bg-[#669999] transition-colors"
            >
              {loginMutation.isPending ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-[#77B7B7] hover:underline">
              Forgot Password? Reset Here
            </a>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden md:flex w-1/2 h-full">
        <img src={bgImage} alt="Cafe Product" className="object-cover w-full h-full" />
      </div>
    </div>
  );
}

