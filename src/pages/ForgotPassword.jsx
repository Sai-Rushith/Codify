import { useState } from "react"
import { BiArrowBack } from "react-icons/bi"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { getPasswordResetToken } from "../services/operations/authAPI"

function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.auth)

  const handleOnSubmit = (e) => {
    e.preventDefault()
    dispatch(getPasswordResetToken(email, setEmailSent))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
      {loading ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white font-medium">Loading...</p>
        </div>
      ) : (
        <div className="w-full max-w-md relative">
          {/* Card Container */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                {!emailSent ? "Reset Password" : "Check Your Email"}
              </h1>
              <div className="w-12 h-1 bg-gradient-to-r from-white to-gray-400 mx-auto rounded-full"></div>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-center mb-8 leading-relaxed">
              {!emailSent
                ? "Don't worry! Enter your email address and we'll send you instructions to reset your password."
                : `We've sent password reset instructions to ${email}. Please check your inbox.`}
            </p>

            {/* Form */}
            <div className="space-y-6">
              {!emailSent && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-200">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      required
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleOnSubmit}
                className="w-full bg-gradient-to-r from-white to-gray-200 text-black font-semibold py-3 px-4 rounded-xl hover:from-gray-100 hover:to-gray-300 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {!emailSent ? "Send Reset Instructions" : "Resend Email"}
              </button>
            </div>

            {/* Back to Login */}
            <div className="mt-8 pt-6 border-t border-white/10">
            <Link to ="/login">
               <button 
                className="flex items-center justify-center gap-2 text-gray-300 hover:text-white transition-colors duration-200 group w-full"
              >
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0L2.586 11a2 2 0 010-2.828L6.293 4.465a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l3.293 3.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                <span>Back to Login</span>
              </button>
            </Link>
           
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-white/3 rounded-full blur-3xl"></div>
        </div>
      )}
    </div>
  )
}

export default ForgotPassword