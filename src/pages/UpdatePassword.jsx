import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { resetPassword } from "../services/operations/authAPI";

function UpdatePassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { password, confirmPassword } = formData;

  const handleOnChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const token = location.pathname.split("/").at(-1);
    dispatch(resetPassword(password, confirmPassword, token, navigate));
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gray-900 flex items-center justify-center px-4">
      {loading ? (
        <div className="text-white text-lg font-medium">Loading...</div>
      ) : (
        <div className="w-full max-w-md bg-black rounded-xl shadow-xl p-8 space-y-6">
          <h1 className="text-2xl font-semibold text-white text-center">
            Choose New Password
          </h1>
          <p className="text-center text-gray-300">
            Almost done. Enter your new password and you’re all set.
          </p>

          <form onSubmit={handleOnSubmit} className="space-y-5">
            <label className="block relative">
              <span className="text-sm font-medium text-gray-200">
                New Password <sup className="text-red-500">*</sup>
              </span>
              <input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleOnChange}
                placeholder="Enter Password"
                className="
                  mt-1
                  w-full
                  bg-gray-800
                  border border-gray-700
                  rounded-lg
                  py-3 px-4 pr-10
                  text-black       /* ← ensures your typed text is white */
                  placeholder-gray-500
                  caret-white       /* ← white cursor */
                  focus:border-white
                  focus:ring-0
                  transition
                "
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black mt-3"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </label>

            <label className="block relative">
              <span className="text-sm font-medium text-gray-200">
                Confirm New Password <sup className="text-red-500">*</sup>
              </span>
              <input
                required
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleOnChange}
                placeholder="Confirm Password"
                className="
                  mt-1
                  w-full
                  bg-gray-800
                  border border-gray-700
                  rounded-lg
                  py-3 px-4 pr-10
                  text-black       /* ← ensures your typed text is white */
                  placeholder-gray-500
                  caret-white       /* ← white cursor */
                  focus:border-white
                  focus:ring-0
                  transition
                "
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black mt-3"
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </label>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition"
            >
              Reset Password
            </button>
          </form>

          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-gray-400 hover:text-white transition"
            >
              <BiArrowBack size={20} className="mr-2" />
              Back to Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdatePassword;
