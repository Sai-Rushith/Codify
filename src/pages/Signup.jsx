import React, { useState } from 'react';
import { Eye, EyeOff, User, GraduationCap } from 'lucide-react';
import HighlightText from "../components/core/HomePage/HighlightText";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "../services/operations/authAPI";
import { setSignupData } from "../slices/authSlice";
import { ACCOUNT_TYPE } from "../util/constants";

export default function SignupForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords Do Not Match");
    }

    dispatch(setSignupData({ ...formData, accountType }));
    dispatch(sendOtp(formData.email, navigate));
 
    console.log("accountype:",ACCOUNT_TYPE);
     
    // reset
    setFormData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
    setAccountType(ACCOUNT_TYPE.STUDENT);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 mt-14">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Join the millions learning to
            <span className="text-white"> code with </span>
            <span className="bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent">
              <HighlightText text={"Codify"} />
            </span>
            <span className="text-white"> for "free"</span>
          </h1>
          <div className="text-gray-300 text-lg space-y-1">
            <p>Build skills for today, tomorrow, and beyond.</p>
            <p className="text-white font-medium">Education to future-proof your career.</p>
          </div>
        </div>

        {/* User Type Selector */}
        <div className="bg-gray-800 rounded-full p-1 mb-8 border border-gray-700">
          <div className="flex">
            <button
              type="button"
              onClick={() => setAccountType(ACCOUNT_TYPE.STUDENT)}
              className={`flex-1 flex items-center justify-center gap-3 py-4 px-8 rounded-full transition-all duration-300 ${
                accountType === ACCOUNT_TYPE.STUDENT
                  ? 'bg-white text-black shadow-lg transform scale-[1.02]'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <User size={20} />
              Student
            </button>
            <button
              type="button"
              onClick={() => setAccountType(ACCOUNT_TYPE.INSTRUCTOR)}
              className={`flex-1 flex items-center justify-center gap-3 py-4 px-8 rounded-full transition-all duration-300 ${
                accountType === ACCOUNT_TYPE.INSTRUCTOR
                  ? 'bg-white text-black shadow-lg transform scale-[1.02]'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <GraduationCap size={20} />
              Instructor
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-white text-sm font-semibold mb-3">
                First Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter first name"
                className="w-full px-5 py-4 bg-white border-2 border-gray-300 rounded-xl text-black placeholder-gray-500 focus:border-black focus:bg-white focus:outline-none transition-all duration-300 hover:border-gray-400"
                required
              />
            </div>
            <div>
              <label className="block text-white text-sm font-semibold mb-3">
                Last Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Enter last name"
                className="w-full px-5 py-4 bg-white border-2 border-gray-300 rounded-xl text-black placeholder-gray-500 focus:border-black focus:bg-white focus:outline-none transition-all duration-300 hover:border-gray-400"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-white text-sm font-semibold mb-3">
              Email Address <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
              className="w-full px-5 py-4 bg-white border-2 border-gray-300 rounded-xl text-black placeholder-gray-500 focus:border-black focus:bg-white focus:outline-none transition-all duration-300 hover:border-gray-400"
              required
            />
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-white text-sm font-semibold mb-3">
                Create Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  className="w-full px-5 py-4 pr-14 bg-white border-2 border-gray-300 rounded-xl text-black placeholder-gray-500 focus:border-black focus:bg-white focus:outline-none transition-all duration-300 hover:border-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black transition-colors duration-300"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-white text-sm font-semibold mb-3">
                Confirm Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm password"
                  className="w-full px-5 py-4 pr-14 bg-white border-2 border-gray-300 rounded-xl text-black placeholder-gray-500 focus:border-black focus:bg-white focus:outline-none transition-all duration-300 hover:border-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black transition-colors duration-300"
                >
                  {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-white text-black font-bold py-5 px-6 rounded-xl hover:bg-gray-100 focus:ring-4 focus:ring-white/30 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl mt-8"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
