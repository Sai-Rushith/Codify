import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { login } from "../services/operations/authAPI"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

export default function Login() {
   const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const { email, password } = formData
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));  
  };

  const handleSubmit = (e) => {
   e.preventDefault();
    console.log('Login attempt:', formData);
     dispatch(login(email, password, navigate))
    // Add your login logic here
  };


  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden mt-10">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-16 h-16 md:w-20 md:h-20 bg-white rounded-full opacity-5 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-20 h-20 md:w-24 md:h-24 bg-white rounded-full opacity-3 animate-bounce"></div>
        <div className="absolute bottom-1/4 left-1/3 w-12 h-12 md:w-16 md:h-16 bg-white rounded-full opacity-4 animate-ping"></div>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-md mx-4 relative z-10">
        <div className="backdrop-blur-xl bg-white/5 border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl">
          {/* Form Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-400 text-sm md:text-base">Sign in to your account</p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Email Field */}
            <div className="group">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 md:py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20 focus:bg-white/10 transition-all duration-300"
                required
              />
            </div>

            {/* Password Field */}
            <div className="group">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 md:py-4 pr-12 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20 focus:bg-white/10 transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link to= "/forgot-password" className="text-sm text-gray-300 hover:text-white transition-colors" >
              
                Forgot password?
            
              </Link>
            
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full py-3 md:py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              Sign In
            </button>

            {/* Sign Up Link */}
            <div className="text-center pt-4">
              <p className="text-gray-400 text-sm">
                Don't have an account?{' '}
                <a href="#" className="text-white hover:text-gray-300 transition-colors font-medium">
                  Sign up here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}