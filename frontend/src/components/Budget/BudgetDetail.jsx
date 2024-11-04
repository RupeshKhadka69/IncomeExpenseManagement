import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { RiFilter3Fill } from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import Loading from "../preloader/Loading";
import PageTitle from "../Typography/PageTitle";
import InputArea from "../form/InputArea";
import { useForm } from "react-hook-form";
import Button from "../form/Button";
import SectionTitle from "../Typography/SectionTitle";
import { Modal } from "antd";
import BudgetServices from "../../services/BudgetService";
import BudgetTableList from "./BudgetTableList";
import { HiOutlineArrowRight, HiOutlineArrowLeft } from "react-icons/hi";

const BudgetDetail = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState("");
  const [data, setData] = useState();
  const { register } = useForm();
  const {
    data: BudgetData,
    refetch,
    isLoading,
  } = useQuery({
    queryFn: () => BudgetServices.GetBudgetList(page, limit),
    queryKey: ["get-budget-list", page, limit],
    enabled: !!page && !!limit,
    select: (d) => d?.data,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    let getData;
    if (query !== "") {
      getData = setTimeout(() => {
        BudgetServices.SearchBudgetList(query)
          .then((response) => {
            setData(response?.data);
          })
          .catch((error) => {});
      }, 800);
      return () => clearTimeout(getData);
    } else {
      setData(BudgetData);
    }
  }, [query, BudgetData]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="px-8">
      <div className="flex justify-between my-4">
        <PageTitle>Budget</PageTitle>
        <Link to="/budget/add-budget" className="">
          <Button>
            <FiPlus className="" />
            Add New
          </Button>
        </Link>
      </div>
      {/* <div>
        <InputArea
          type="search"
          autoComplete="off"
          register={register}
          name="search"
          handleChange={(e) => setQuery(e.target.value)}
        />
      </div> */}

      <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow overflow-hidden">
        <div className="flex justify-between">
          <PageTitle>Budget List</PageTitle>
          <div>
            <div className="searchbox">
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              <input
                autoComplete="off"
                inputMode="search"
                name="search"
                placeholder="search the list here"
                type="search"
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        {isLoading ? (
          <Loading loading={isLoading} />
        ) : (
          <>
            <BudgetTableList data={data?.budget} refetch={refetch} />
            <div className="mt-4 flex justify-between items-center text-black  dark:text-white">
              <div>
                Showing page {data?.currentPage ? data?.currentPage : 0} of{" "}
                {data?.totalPages ? data?.totalPages : 0}
              </div>
              <div className="flex gap-2">
                <button
                  className="text-white dark:text-gray-900 cursor-pointer bg-blue-600 dark:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2  dark:hover:bg-blue-700 "
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  <HiOutlineArrowLeft className="h-4 w-4" />
                </button>
                <button
                  className="text-white dark:text-gray-900 cursor-pointer bg-blue-600 dark:bg-blue-400  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2  dark:hover:bg-blue-700 "
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === data?.totalPages}
                >
                  <HiOutlineArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BudgetDetail;
