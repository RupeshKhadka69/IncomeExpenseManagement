import React, { useEffect } from "react";
import InputArea from "../../utils/InputArea";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { notifyError, notifySuccess } from "../../utils/Toast";
import ExpenseServices from "../../services/ExpenseService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../form/Button";
import SectionTitle from "../Typography/SectionTitle";
import PageTitle from "../Typography/PageTitle";
import { RxCross2 } from "react-icons/rx";
import LabelArea from "../form/LabelArea";
const AddExpense = () => {
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
    queryFn: () => ExpenseServices.GetSingleExpense(id),
    queryKey: ["get-single-expense", id],
    enabled: !!id,
    select: (d) => d?.data,
    refetchOnWindowFocus: false,
    onSuccess: (d) => {
      console.log("data", d);
      reset({ ...d });
    },
  });

  const onSubmit = async (data) => {
    //   data.patient_id = patientDetails?.patient?.patient_id;
    if (id) {
      try {
        data.amount = parseFloat(data.amount);
        const res = await ExpenseServices.UpdateExpense(id, data);
        notifySuccess(res?.message);
        navigate(-1);
      } catch (e) {
        notifyError(e?.response?.data?.message);
      }
    } else {
      try {
        data.amount = parseFloat(data.amount);
        const res = await ExpenseServices.CreateExpense(data);
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
      amount: "",
      category: "",
      date: "",
      description: "",
    });
  };
  return (
    <div className="p-8">
      <div className="flex justify-between mb-5">
        <PageTitle className="text-primary dark:text-primary">
          {id ? "Edit" : "Add"} Expense
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
          <div className="">
            <InputArea register={register} name="name" />
          </div>
        </div>
        <div className="grid grid-cols-5 mt-2 gap-2">
          <LabelArea label="Amount:" />
          <InputArea
            register={register}
            name="amount"
            type="number"
            step="0.01"
            parseAs="float"
          />
        </div>
        <div className="grid grid-cols-5 mt-2 gap-2">
          <LabelArea label="Category:" />
          <InputArea register={register} name="category" />
        </div>
        <div className="grid grid-cols-5 mt-2 gap-2">
          <LabelArea label="Date:" />
          <InputArea register={register} name="date" type="date" />
        </div>
        <div className="grid grid-cols-5 mt-2 gap-2">
          <LabelArea label="Description:" />
          <InputArea register={register} name="description" />
        </div>
        <div className="grid grid-cols-5 mt-8 gap-2">
          <div className="col-span-2 flex justify-end">
            <Button>
              <input type="submit" value="Add" className="cursor-pointer" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddExpense;
