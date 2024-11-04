import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import InputArea from "../utils/InputArea";
import Error from "../utils/Error";
import Loading from "../utils/Loading";
import { AdminContext } from "../context/AdminContext";
import AdminService from "../services/AdminService";
import { notifyError, notifySuccess } from "../utils/Toast";
import { Link } from "react-router-dom";
const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useContext(AdminContext);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setValue("email", e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setValue("password", e.target.value);
  };
  const passwords = watch("password");
  const emails = watch("email");

  console.log("password", passwords);
  console.log("emails", emails);

  const onSubmit = async () => {
    setLoading(true);
    try {
      const response = await AdminService.login({ email, password });

      console.log("Response:", response);

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
      alert("An error occurred. Please try again later.");
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
                id="email"
                register={register}
                handleChange={handleEmailChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
                placeholder="Enter your email"
              />
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
            </div>

            <div className="space-y-4">
              <button
                disabled={loading}
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loading loading={loading} /> : "Sign in"}
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
