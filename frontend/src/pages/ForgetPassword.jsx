import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import InputArea from "../utils/InputArea";
import Loading from "../utils/Loading";
import Error from "../utils/Error";
import AdminService from "../services/AdminService";
import { notifyError, notifySuccess } from "../utils/Toast";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setValue("email", e.target.value);
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      // Update this with your actual API endpoint
      const response = await AdminService.forgotPassword({ email });

      if (response?.statuscode === 200) {
        notifySuccess(response?.message || "Password reset link sent to your email");
        setEmailSent(true);
      } else {
        notifyError(response?.message || "Failed to send reset link");
      }
    } catch (error) {
      console.error("Error requesting password reset:", error);
      notifyError(error?.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center p-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="space-y-2 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              Forgot Password
            </h2>
            <p className="text-gray-500 text-center text-sm">
              {emailSent
                ? "Check your email for the reset link"
                : "Enter your email to receive a password reset link"}
            </p>
          </div>

          {!emailSent ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <InputArea
                  name="email"
                  type="email"
                  id="email"
                  register={register}
                  rules={{ required: "Email is required" }}
                  handleChange={handleEmailChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
                  placeholder="Enter your email"
                />
                {errors.email && <Error message={errors.email.message} />}
              </div>

              <div className="space-y-4">
                <button
                  disabled={loading}
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loading loading={loading} /> : "Send Reset Link"}
                </button>

                <p className="text-center text-sm text-gray-500">
                  Remember your password?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Back to login
                  </Link>
                </p>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-700 text-center">
                  We've sent a password reset link to {email}
                </p>
              </div>
              <button
                onClick={() => setEmailSent(false)}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ease-in-out"
              >
                Send to a different email
              </button>
              <p className="text-center text-sm text-gray-500">
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Back to login
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;