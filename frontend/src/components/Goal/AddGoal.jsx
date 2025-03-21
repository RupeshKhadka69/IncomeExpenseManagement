import React, { useEffect } from "react";
import InputArea from "../../utils/InputArea";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { notifyError, notifySuccess } from "../../utils/Toast";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../form/Button";
import PageTitle from "../Typography/PageTitle";
import { RxCross2 } from "react-icons/rx";
import LabelArea from "../form/LabelArea";
import InputDate from "../form/InputDate";
import TextArea from "../form/TextArea";
import SelectArea from "../form/SelectArea";
import GoalService from "../../services/GoalService";
const AddGoal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  const { data, refetch, isLoading } = useQuery({
    queryFn: () => GoalService.GetSingleGoal(id),
    queryKey: ["get-single-goal", id],
    enabled: !!id,
    select: (d) => d?.data,
    refetchOnWindowFocus: false,
    onSuccess: (d) => {
      console.log("data", d);
      reset({ ...d });
    },
  });
  console.log("data", data?.date);
  const onSubmit = async (data) => {
    //   data.patient_id = patientDetails?.patient?.patient_id;
    if (id) {
      try {
        data.amount = parseFloat(data.amount);
        const res = await GoalService.UpdateGoal(id, data);
        notifySuccess(res?.message);
        navigate(-1);
      } catch (e) {
        notifyError(e?.response?.data?.message);
      }
    } else {
      try {
        data.amount = parseFloat(data.amount);
        const res = await GoalService.CreateGoal(data);
        notifySuccess(res?.message);
        navigate(-1);
      } catch (e) {
        notifyError(e?.response?.data?.message);
      }
    }
  };
  const handleReset = () => {
    reset({
      name: "",
      targetAmount: "",
      currentAmount: "",
      deadline: "",
    });
  };
  return (
    <div className="p-8">
      <div className="flex justify-between mb-5">
        <PageTitle className="text-primary dark:text-primary">
          {id ? "Edit" : "Add"} Budget
        </PageTitle>
        <button
          type="button"
          onClick={handleReset}
          className="py-1.5 px-3 bg-white hover:bg-gray-50 hover:text-gray-600 text-sm text-gray-500 border border-primary rounded-lg flex items-center justify-center"
        >
          {" "}
          <RxCross2 />
          Clear
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-5 mt-2 gap-2">
          <LabelArea label="Name:" />
          <div className="col-span-2">
            <InputArea register={register} name="name" />
          </div>
        </div>
        <div className="grid grid-cols-5 mt-2 gap-2">
          <LabelArea label="Target Amount:" />
          <div className="col-span-2">
            <InputArea
              register={register}
              name="targetAmount"
              type="number"
              step="0.01"
              parseAs="float"
            />
          </div>
        </div>
        <div className="grid grid-cols-5 mt-2 gap-2">
          <LabelArea label="Current Amount:" />
          <div className="col-span-2">
            <InputArea
              register={register}
              name="currentAmount"
              type="number"
              step="0.01"
              parseAs="float"
            />
          </div>
        </div>

        <div className="grid grid-cols-5 mt-2 gap-2">
          <LabelArea label="Dealine:" />
          <div className="col-span-2">
            <InputDate
              register={register}
              setValue={setValue}
              name="deadline"
              defaultValue={data?.deadline}
              hideDefaultValue={!data?.deadline}
            />
          </div>
        </div>
        <div className="grid grid-cols-5 mt-8 gap-2">
          <div className="col-span-3 flex justify-end">
            <Button>
              <input
                type="submit"
                value={id ? "Edit" : "Add"}
                className="cursor-pointer"
              />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddGoal;
