import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import InputArea from "../utils/InputArea";
import Loading from "../utils/Loading";
import Error from "../utils/Error";
import AdminService from "../services/AdminService";
import { notifyError, notifySuccess } from "../utils/Toast";
import { AdminContext } from "../context/AdminContext";

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tokenValid, setTokenValid] = useState(null); // null means not checked yet
  const [tokenChecking, setTokenChecking] = useState(true);
  const { dispatch } = useContext(AdminContext);

  const { resetToken } = useParams();
  console.log("resetToken", resetToken);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  // Check token validity when component mounts
  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Optional: You could add an API endpoint to verify token before submitting the form
        // For now we'll assume the token is valid if it exists
        if (resetToken) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
        }
      } catch (error) {
        setTokenValid(false);
      } finally {
        setTokenChecking(false);
      }
    };

    verifyToken();
  }, [resetToken]);

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
    setValue("newPassword", e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setValue("confirmPassword", e.target.value);
  };
  const onSubmit = async () => {
    if (newPassword !== confirmPassword) {
      notifyError("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      console.log("Attempting password reset with token:", resetToken);
      console.log(
        "API URL:",
        `${process.env.REACT_APP_API_URL}/user/reset-password/${resetToken}`
      );

      // Update with your actual API endpoint
      const response = await AdminService.resetPassword(resetToken, {
        newPassword,
      });
      console.log("Reset password response:", response);
      const { user, jwtToken } = response.data;

      if (response?.statuscode === 200 || response?.status === 301) {
        notifySuccess("Password reset successfully");
        // Redirect to login after successful reset

        localStorage.setItem(
          "adminInfo",
          JSON.stringify({ user, token: jwtToken })
        );

        // Update the context with user information
        dispatch({
          type: "USER_LOGIN",
          payload: { user, token: jwtToken },
        });

        // Redirect to home page
        navigate("/");
      } else {
        notifyError(response?.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Error details:", error);
      notifyError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking token
  if (tokenChecking) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
        <Loading loading={true} />
      </div>
    );
  }

  // Show error if token is invalid
  if (tokenValid === false) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center p-4">
        <div className="max-w-lg w-full bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="space-y-2 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 text-center">
                Invalid Reset Link
              </h2>
              <p className="text-gray-500 text-center">
                This password reset link is invalid or has expired.
              </p>
            </div>
            <button
              onClick={() => navigate("/forgot-password")}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Request a new link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center p-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="space-y-2 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              Reset Your Password
            </h2>
            <p className="text-gray-500 text-center text-sm">
              Enter a new password for your account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <div className="relative">
                <InputArea
                  register={register}
                  name="newPassword"
                  rules={{
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  }}
                  handleChange={handlePasswordChange}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? (
                    <BsEyeSlashFill className="w-5 h-5" />
                  ) : (
                    <BsEyeFill className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <Error message={errors.newPassword.message} />
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="relative">
                <InputArea
                  register={register}
                  name="confirmPassword"
                  rules={{
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === watch("newPassword") || "Passwords don't match",
                  }}
                  handleChange={handleConfirmPasswordChange}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showConfirmPassword ? (
                    <BsEyeSlashFill className="w-5 h-5" />
                  ) : (
                    <BsEyeFill className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <Error message={errors.confirmPassword.message} />
              )}
            </div>

            <div className="space-y-4">
              <button
                disabled={loading}
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loading loading={loading} /> : "Reset Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
