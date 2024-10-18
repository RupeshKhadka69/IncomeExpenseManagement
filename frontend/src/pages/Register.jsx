import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import InputArea from "../utils/InputArea";
import Error from "../utils/Error";
import Loading from "../utils/Loading";
import AdminService from "../services/AdminService";
import Button from "../components/form/Button";
import Uploader from "../components/form/Uploader";
import { notifyError, notifySuccess } from "../utils/Toast";

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const [profileStatus] = watch(["profile_picture"]);
  const navigate = useNavigate();
  const onSubmit =  async (data) => {
    
    const formData = new FormData();
    for (const name in data) {
      formData.append(name, data[name]);
    }
    formData.delete("profile_picture");
    formData.append(
      `profile_picture`,
      typeof data?.profile_picture === "object"
        ? data?.profile_picture?.[0]
        : data?.profile_picture
    );
    try {
      const res = await AdminService.Register(formData);
      notifySuccess(res?.message);
      console.log("res",res);
      console.log("mess",res?.message);
      navigate("/")
    } catch (e) {
      notifyError(e?.response?.data?.message);
    }
  };
  return (
    <div>
      <div className="max-w-[600px] mx-auto">
        <h2>Register</h2>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* for username */}
            <div>
              <label htmlFor="name">Username</label>
              <InputArea name="username" type="text" register={register} />
            </div>
            {/* for username */}
            <div>
              <label htmlFor="email">email</label>
              <InputArea name="email" type="email" register={register} />
            </div>
            <div>
              <label htmlFor="password">password</label>
              <InputArea name="password" type="password" register={register} />
            </div>
            <div>
              <label htmlFor="picture">Profile Picture</label>
              <Uploader
                errors={errors}
                name={"profile_picture"}
                register={register}
                id={"profile_picture"}
                watch={watch}
                replaceFile={profileStatus?.length > 0 ? profileStatus : ""}
              />
            </div>

            <Button>
              <input type="submit" value="submit" className="cursor-pointer" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
