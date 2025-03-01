import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import Loading from "../utils/Loading";
import { notifyError, notifySuccess } from "../utils/Toast";
import AdminServices from "../services/AdminService";
import { useQuery } from "@tanstack/react-query";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(AdminContext);

  // Use React Query to fetch user data
  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => AdminServices.getUserMe(),
    queryKey: ["get-user"],
    select: (response) => response,
    refetchOnWindowFocus: false,
    retry: (count, { response }) => {
      return response?.status !== 403 && response?.status !== 404;
    }, // Only retry once to avoid infinite loops on auth failure
  });

  // Process data when it's available
  useEffect(() => {
    if (!isLoading) {
      if (isError) {
        console.error("Error fetching user data:", error);
        notifyError("Authentication failed. Please try again.");
        navigate("/login");
        return;
      }

      if (data) {
        try {
          // Store user data in localStorage
          localStorage.setItem(
            "adminInfo",
            JSON.stringify({
              user: data?.data?.user,
              token: data.jwtToken,
            })
          );

          // Update context
          dispatch({
            type: "USER_LOGIN",
            payload: {
              user: data?.data?.user,
              token: data.jwtToken,
            },
          });

          notifySuccess("Successfully signed in with Google");
          navigate("/");
        } catch (err) {
          console.error("Error processing user data:", err);
          notifyError("Failed to process authentication data.");
          navigate("/login");
        }
      } else {
        notifyError("No user data received. Please try again.");
        navigate("/login");
      }
    }
  }, [data, isLoading, isError, dispatch, navigate, error]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center p-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-xl overflow-hidden p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Completing Authentication
        </h2>
        {isLoading ? (
          <div className="flex justify-center">
            <Loading loading={true} size="large" />
          </div>
        ) : (
          <p className="text-gray-500">Redirecting you to the dashboard...</p>
        )}
      </div>
    </div>
  );
};

export default GoogleCallback;
