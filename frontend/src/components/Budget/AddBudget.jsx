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
import BudgetServices from "../../services/BudgetService";
const AddBudget = () => {
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
    queryFn: () => BudgetServices.GetSingleBudget(id),
    queryKey: ["get-single-budget", id],
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
        const res = await BudgetServices.UpdateBudget(id, data);
        notifySuccess(res?.message);
        navigate(-1);
      } catch (e) {
        notifyError(e?.response?.data?.message);
      }
    } else {
      try {
        data.amount = parseFloat(data.amount);
        const res = await BudgetServices.CreateBudget(data);
        notifySuccess(res?.message);
        navigate(-1);
      } catch (e) {
        notifyError(e?.response?.data?.message);
      }
    }
  };
  const handleReset = () => {
    reset({
      BudgetName: "",
      amount: "",
      startDate: "",
      endDate: "",
      period: "",
      description: "",
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
            <InputArea register={register} name="BudgetName" />
          </div>
        </div>
        <div className="grid grid-cols-5 mt-2 gap-2">
          <LabelArea label="Amount:" />
          <div className="col-span-2">
            <InputArea
              register={register}
              name="amount"
              type="number"
              step="0.01"
              parseAs="float"
            />
          </div>
        </div>

        <div className="grid grid-cols-5 mt-2 gap-2">
          <LabelArea label="Start Date:" />
          <div className="col-span-2">
            <InputDate
              register={register}
              setValue={setValue}
              name="startDate"
              defaultValue={data?.startDate}
              hideDefaultValue={!data?.startDate}
            />
          </div>
        </div>
        <div className="grid grid-cols-5 mt-2 gap-2">
          <LabelArea label="End Date:" />
          <div className="col-span-2">
            <InputDate
              register={register}
              setValue={setValue}
              name="endDate"
              defaultValue={data?.endDate}
              hideDefaultValue={!data?.endDate}
            />
          </div>
        </div>
        <div className="grid grid-cols-5 mt-2 gap-2">
          <LabelArea label="Period:" />
          <div className="col-span-2">
            <SelectArea
              register={register}
              name="period"
              optionList={[
                { id: "daily", name: "daily" },
                { id: "weekly", name: "weekly" },
                { id: "monthly", name: "monthly" },
                { id: "yearly", name: "yearly" },
              ]}
              showSelect={true}
            />
          </div>
        </div>
        <div className="grid grid-cols-5 mt-2 gap-2 items-start">
          <div className="self-start pt-1">
            <LabelArea label="Description:" />
          </div>
          <div className="col-span-2">
            <TextArea register={register} name="description" />
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

export default AddBudget;
