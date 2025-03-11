import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import InputArea from "../utils/InputArea";
import Error from "../utils/Error";
import Loading from "../utils/Loading";
import { AdminContext } from "../context/AdminContext";
import AdminService from "../services/AdminService";
import { notifyError, notifySuccess } from "../utils/Toast";
import { Link } from "react-router-dom";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useContext(AdminContext);

  // Email validation pattern
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setError,
    trigger,
  } = useForm({
    mode: "onChange", // Change to onChange for more responsive validation
    criteriaMode: "all", // Show all validation errors
    reValidateMode: "onChange", // Re-validate when fields change
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const PASSWORD_REGEX = /^.{6,}$/;
  const onSubmit = async (data) => {
    if (data?.email === "" || !emailPattern.test(data?.email)) {
      setError("email", {
        type: "manual",
        message: "Please enter valid email address",
      });
      return;
    }
    if (data.password === "") {
      setError("password", {
        type: "manual",
        message: "Password is required.",
      });
      return;
    }
    if (!PASSWORD_REGEX.test(data.password)) {
      setError("password", {
        type: "manual",
        message: "Password must be minimum 7 characters.",
      });
      return;
    }
    if (data.password === "") {
      setError("password", {
        type: "manual",
        message: "Password is required.",
      });
      return;
    }
    if (!PASSWORD_REGEX.test(data.password)) {
      setError("password", {
        type: "manual",
        message: "Password must be minimum 6 characters.",
      });
      return;
    }
    setLoading(true);

    try {
      const response = await AdminService.login({
        email: data.email,
        password: data.password,
      });

      if (response?.statuscode === 200) {
        const { user, jwtToken } = response.data;
        notifySuccess(response?.message);
        // Store the entire user object and token in localStorage
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
        notifyError(response?.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
      notifyError(
        error?.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    // Redirect to the Google OAuth endpoint
    window.location.href = `http://localhost:8000/user/google`;
  };

  // Custom handlers for input changes to revalidate fields immediately
  const handleEmailChange = (e) => {
    // Trigger validation on the email field immediately after change
    setTimeout(() => {
      trigger("email");
    }, 100);
  };

  const handlePasswordChange = (e) => {
    // Trigger validation on the password field immediately after change
    setTimeout(() => {
      trigger("password");
    }, 100);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center p-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="space-y-2 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              Welcome back
            </h2>
            <p className="text-gray-500 text-center text-sm">
              Please enter your details to sign in
            </p>
          </div>

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
                label="Email"
                id="email"
                register={register}
                handleChange={handleEmailChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
                placeholder="Enter your email"
              />
              {errors.email && <Error errorName={errors.email} />}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <InputArea
                  register={register}
                  name="password"
                  label="Password"
                  handleChange={handlePasswordChange}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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
              {errors.password && <Error errorName={errors.password} />}
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot password?
              </Link>
            </div>

            <div className="space-y-4">
              <button
                disabled={loading}
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loading loading={loading} /> : "Sign in"}
              </button>

              {/* Divider */}
              <div className="relative flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-sm">
                  or
                </span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              {/* Google Sign-In Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {googleLoading ? (
                  <Loading loading={googleLoading} />
                ) : (
                  <>
                    <FcGoogle className="w-5 h-5 mr-2" />
                    Sign in with Google
                  </>
                )}
              </button>

              <p className="text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  to={"/register"}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
