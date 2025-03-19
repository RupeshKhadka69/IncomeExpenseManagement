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
import GoalServices from "../../services/GoalService";
import GoalTableList from "./GoalTableList";
import { HiOutlineArrowRight, HiOutlineArrowLeft } from "react-icons/hi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const GoalDetail = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState("");
  const [data, setData] = useState();
  const { register } = useForm();
  const {
    data: GoalData,
    refetch,
    isLoading,
  } = useQuery({
    queryFn: () => GoalServices.GetGoalList(page, limit),
    queryKey: ["get-goal-list", page, limit],
    enabled: !!page && !!limit,
    select: (d) => d?.data,
    refetchOnWindowFocus: false,
  });
  const { data: GoalBudgetData, isLoading: goalsBudgetLoading } = useQuery({
    queryFn: () => GoalServices.GetGoalBudgetList(),
    queryKey: ["get-goal-budget-list"],
    select: (d) => d?.data,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    let getData;
    if (query !== "") {
      getData = setTimeout(() => {
        GoalServices.SearchGoalList(query)
          .then((response) => {
            setData(response?.data);
          })
          .catch((error) => {});
      }, 800);
      return () => clearTimeout(getData);
    } else {
      setData(GoalData);
    }
  }, [query, GoalData]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Format the data for the charts
  const formatChartData = () => {
    if (!GoalBudgetData) return null;

    const { goals, budgets } = GoalBudgetData;

    // Line chart data for goals progress
    const lineChartData = {
      labels: goals.map((goal) => goal.name),
      datasets: [
        {
          label: "Target Amount",
          data: goals.map((goal) => goal.targetAmount),
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
          tension: 0.4,
        },
        {
          label: "Current Amount",
          data: goals.map((goal) => goal.currentAmount),
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          tension: 0.4,
        },
      ],
    };

    // Bar chart data for budget allocation
    const barChartData = {
      labels: budgets.map((budget) => budget.name),
      datasets: [
        {
          label: "Budget Amount",
          data: budgets.map((budget) => budget.amount),
          backgroundColor: "rgba(255, 159, 64, 0.6)",
          borderColor: "rgb(255, 159, 64)",
          borderWidth: 1,
        },
      ],
    };

    // Doughnut chart for goal progress percentage
    const progressChartData = {
      labels: goals.map((goal) => goal.name),
      datasets: [
        {
          label: "Progress (%)",
          data: goals.map((goal) => goal.progress),
          backgroundColor: [
            "rgba(255, 99, 132, 0.7)",
            "rgba(54, 162, 235, 0.7)",
            "rgba(255, 206, 86, 0.7)",
            "rgba(75, 192, 192, 0.7)",
            "rgba(153, 102, 255, 0.7)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    return { lineChartData, barChartData, progressChartData };
  };

  const chartData = formatChartData();

  // Chart options
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Goals Progress Tracking",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Budget Allocation",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Goal Progress (%)",
      },
    },
  };
console.log("chartData",chartData)
  return (
    <>
      <div className="px-8 py-6">
        {goalsBudgetLoading ? (
          <Loading loading={goalsBudgetLoading} />
        ) : GoalBudgetData ? (
          <>
            {/* Summary Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow mb-8">
              <PageTitle>Financial Overview</PageTitle>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                    Goals Summary
                  </h3>
                  <p className="mt-2">
                    Total Goals:{" "}
                    <span className="font-bold">
                      {GoalBudgetData.summary.totalGoals}
                    </span>
                  </p>
                  <p>
                    Total Target Amount:{" "}
                    <span className="font-bold">
                      Rs
                      {GoalBudgetData.summary.totalGoalAmount.toLocaleString()}
                    </span>
                  </p>
                  <p>
                    Average Progress:{" "}
                    <span className="font-bold">
                      {GoalBudgetData.summary.averageGoalProgress.toFixed(
                        2
                      )}
                      %
                    </span>
                  </p>
                </div>
                <div className="bg-orange-100 dark:bg-orange-900 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-orange-700 dark:text-orange-300">
                    Budget Summary
                  </h3>
                  <p className="mt-2">
                    Total Budgets:{" "}
                    <span className="font-bold">
                      {GoalBudgetData.summary.totalBudgets}
                    </span>
                  </p>
                  <p>
                    Total Budget Amount:{" "}
                    <span className="font-bold">
                      Rs
                      {GoalBudgetData.summary.totalBudgetAmount.toLocaleString()}
                    </span>
                  </p>
                </div>
                <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">
                    Financial Health
                  </h3>
                  <p className="mt-2">
                    Budget vs Goals Ratio:{" "}
                    <span className="font-bold">
                      {(
                        (GoalBudgetData.summary.totalBudgetAmount /
                          GoalBudgetData.summary.totalGoalAmount) *
                        100
                      ).toFixed(2)}
                      %
                    </span>
                  </p>
                  <p>
                    Funding Gap:{" "}
                    <span className="font-bold">
                      Rs
                      {(
                        GoalBudgetData.summary.totalGoalAmount -
                        GoalBudgetData.summary.totalBudgetAmount
                      ).toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Goals Progress Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow">
                <SectionTitle>Goals Progress</SectionTitle>
                <div className="h-64">
                  {chartData && (
                    <Line
                      options={lineOptions}
                      data={chartData.lineChartData}
                    />
                  )}
                </div>
              </div>

              {/* Budget Allocation Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow">
                <SectionTitle>Budget Allocation</SectionTitle>
                <div className="h-64">
                  {chartData && (
                    <Bar options={barOptions} data={chartData.barChartData} />
                  )}
                </div>
              </div>
            </div>

            {/* Goals Progress Percentage Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow mb-8">
              <SectionTitle>Goal Progress Percentage</SectionTitle>
              <div className="flex justify-center">
                <div className="w-64 h-64">
                  {chartData && (
                    <Doughnut
                      options={doughnutOptions}
                      data={chartData.progressChartData}
                    />
                  )}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>

      <div className="px-8">
        <div className="flex justify-between my-4">
          <PageTitle>Goal</PageTitle>
          <Link to="/goal/add-goal" className="">
            <Button>
              <FiPlus className="" />
              Add New
            </Button>
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow overflow-hidden">
          <div className="flex justify-between">
            <PageTitle>Goal List</PageTitle>
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
              <GoalTableList data={data?.Goal} refetch={refetch} />
              <div className="mt-4 flex justify-between items-center text-black dark:text-white">
                <div>
                  Showing page {data?.currentPage ? data?.currentPage : 0} of{" "}
                  {data?.totalPages ? data?.totalPages : 0}
                </div>
                <div className="flex gap-2">
                  <button
                    className="text-white dark:text-gray-900 cursor-pointer bg-blue-600 dark:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:hover:bg-blue-700"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  >
                    <HiOutlineArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    className="text-white dark:text-gray-900 cursor-pointer bg-blue-600 dark:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:hover:bg-blue-700"
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
    </>
  );
};

export default GoalDetail;
