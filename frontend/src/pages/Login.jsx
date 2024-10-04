import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import InputArea from "../utils/InputArea";
import Error from "../utils/Error";
import Loading from "../utils/Loading";
import { AdminContext } from "../context/AdminContext";
import AdminService from "../services/AdminService";

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
    formState: { errors },
  } = useForm();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      const response = await AdminService.login({ email, password });
  
      console.log("Response:", response);
  
      if (response?.statuscode === 200) {
        const { user, jwtToken } = response.data;
  
        // Store the entire user object and token in localStorage
        localStorage.setItem("adminInfo", JSON.stringify({ user, token: jwtToken }));
  
        // Update the context with user information
        dispatch({
          type: "USER_LOGIN",
          payload: { user, token: jwtToken },
        });
  
        // Redirect to home page
        navigate("/");
      } else {
        console.error("Unexpected response format:", response);
        alert("An error occurred. Please try again later.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
 
  

  return (
    <div className="login">
      <div>
        <div>Login Form</div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email">Email</label>
            <InputArea
              name="email"
              type="email"
              id="email"
              register={register}
              handleChange={handleEmailChange}
            />
          </div>
          <div className="space-y-1 mb-5">
            <label htmlFor="password">Password</label>
            <div className="relative flex items-center">
              <InputArea
                register={register}
                label="Password"
                name="password"
                handleChange={handlePasswordChange}
                type={`${showPassword ? "text" : "password"}`}
                placeholder="********"
                className="rounded-sm h-9"
              />
              {showPassword ? (
                <BsEyeSlashFill
                  onClick={() => setShowPassword(false)}
                  className="absolute cursor-pointer right-3 dark:text-slate-400"
                />
              ) : (
                <BsEyeFill
                  onClick={() => setShowPassword(true)}
                  className="absolute cursor-pointer right-3 dark:text-slate-400"
                />
              )}
            </div>
            <Error errorName={errors.password} />
          </div>
          {loading ? (
            <Loading loading={loading} />
          ) : (
            <button
              disabled={loading}
              type="submit"
              className={`primary_btn !rounded-sm !h-10`}
            >
              Log in
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
