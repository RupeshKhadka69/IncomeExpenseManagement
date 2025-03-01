import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import InputArea from "../utils/InputArea";
import Error from "../utils/Error";
import AdminService from "../services/AdminService";
import Uploader from "../components/form/Uploader";
import { notifyError, notifySuccess } from "../utils/Toast";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AdminServices from "../services/AdminService";

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange", // Change to onChange for more responsive validation
    criteriaMode: "all", // Show all validation errors
    reValidateMode: "onChange", // Re-validate when fields change
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });
  const { id } = useParams();

  const { data, refetch, isLoading } = useQuery({
    queryFn: () => AdminServices.getUserMe(),
    queryKey: ["get-user"],
    select: (d) => d?.data?.user,
    refetchOnWindowFocus: false,
    enabled: !!id,
    onSuccess: (d) => {
      console.log("data", d);
      reset({ ...d });
    },
  });
  const [profileStatus] = watch(["profile_picture"]);
  const navigate = useNavigate();
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const onSubmit = async (data) => {
    try {
      if (id) {
        // For update, create FormData only if there's a new file
        let payload;
        if (
          data.profile_picture instanceof FileList ||
          data.profile_picture instanceof File
        ) {
          const formData = new FormData();
          // Add all non-file fields
          Object.keys(data).forEach((key) => {
            if (key !== "profile_picture") {
              formData.append(key, data[key]);
            }
          });
          // Add the file if it exists
          if (data.profile_picture instanceof FileList) {
            formData.append("profile_picture", data.profile_picture[0]);
          } else if (data.profile_picture instanceof File) {
            formData.append("profile_picture", data.profile_picture);
          }
          payload = formData;
        } else {
          // If no new file, send regular JSON
          payload = data;
        }

        const res = await AdminService.updateUser(payload);
        notifySuccess(res?.message);
        navigate("/");
      } else {
        // For new registration, always use FormData
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
          if (key === "profile_picture" && data[key]) {
            formData.append(key, data[key][0]);
          } else {
            formData.append(key, data[key]);
          }
        });

        const res = await AdminService.Register(formData);
        notifySuccess(res?.message);
        navigate("/");
      }
    } catch (e) {
      notifyError(e?.response?.data?.message);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br bg-white dark:bg-gray-800 flex justify-center items-center p-4">
      <div className="max-w-xl w-full bg-gray-50 dark:bg-gray-700 dark:text-gray-400 rounded-xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="space-y-2 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
              {id ? "Update" : "Create"} an Account
            </h2>
            {!id && (
              <p className="text-gray-500 text-center text-sm">
                Please fill in your information to get started
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Username
              </label>
              <InputArea
                name="username"
                type="text"
                id="username"
                label="Username"
                register={register}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
                placeholder="Choose a username"
                rules={{
                  required: "Username is required",
                }}
              />
              {errors.username && <Error errorName={errors.username} />}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Email Address
              </label>
              <InputArea
                name="email"
                type="email"
                label="Email"
                id="email"
                register={register}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: emailPattern,
                    message: "Please enter a valid email address",
                  },
                }}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
                placeholder="Enter your email"
              />
              {errors.email && <Error errorName={errors.email} />}
            </div>

            {!id && (
              <>
                {/* Password Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <InputArea
                    name="password"
                    type="password"
                    id="password"
                    register={register}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
                    placeholder="Create a strong password"
                    rules={{
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    }}
                  />
                  {errors.password && <Error errorName={errors.password} />}
                </div>
              </>
            )}

            {/* Profile Picture Upload */}
            <div className="space-y-2">
              <label
                htmlFor="profile_picture"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Profile Picture
              </label>
              <div className="mt-1">
                <Uploader
                  errors={errors}
                  name="profile_picture"
                  register={register}
                  id="profile_picture"
                  watch={watch}
                  replaceFile={profileStatus?.length > 0 ? profileStatus : ""}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
                />
              </div>
              {errors?.profile_picture && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.profile_picture.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="space-y-4">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ease-in-out"
              >
                {id ? "Update" : "Create"} Account
              </button>

              {!id && (
                <p className="text-center text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link
                    to={"/login"}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign in
                  </Link>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
