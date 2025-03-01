import React from "react";
import { useQuery } from "@tanstack/react-query";
import AdminServices from "../services/AdminService";
import { useNavigate } from "react-router-dom";
import DashboardService from "../services/DashboardService";
import Loading from "../utils/Loading";
import {
  FaArrowUp,
  FaArrowDown,
  FaChartPie,
  FaMoneyBillWave,
  FaRegCalendarAlt,
} from "react-icons/fa";
import HomeChart from "./HomeChart";
import FinancialAdvice from "./FinancialAdvice"; // Import the new component

const Home = () => {
  const navigate = useNavigate();
  const { data: apiCard, isLoading } = useQuery({
    queryFn: () => AdminServices.getUserMe(),
    queryKey: ["get-user"],
    select: (d) => d?.data,
    staleTime: 0,
    refetchInterval: 60000, //* every 1 minute
    refetchOnWindowFocus: false,
    retry: (count, { response }) => {
      return response?.status !== 403 && response?.status !== 404;
    },
  });

  const { data: incomeExpense } = useQuery({
    queryFn: () => DashboardService.getIncomeExpense(),
    queryKey: ["get-income-expense-list"],
    select: (d) => d?.data,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryFn: () => DashboardService.getSummary(),
    queryKey: ["get-financial-summary"],
    select: (d) => d?.data,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  const { data: financialForecast } = useQuery({
    queryFn: () => DashboardService.getForecast(),
    queryKey: ["get-financial-forecast"],
    select: (d) => d?.data,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  // Format currency values
  const formatCurrency = (value) => {
    if (!value && value !== 0) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 max-w-[1600px] mx-auto">
              {/* Main Content Column */}
              <div className="space-y-6">
                {/* Header Section with Summary Stats */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Financial Overview
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Track your financial performance and insights
                  </p>
                </div>

                {/* Chart Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Income vs Expenses
                  </h2>
                  <HomeChart incomeExpense={incomeExpense} />
                </div>

                {/* Financial Advice Section (AI, Insights, Suggestions) */}
                {summaryLoading ? (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                    <h2>loading Ai data</h2>
                    <Loading loading={summaryLoading} />
                  </div>
                ) : (
                  <FinancialAdvice summary={summary} />
                )}
              </div>

              {/* Sidebar Column */}
              <div className="space-y-6">
                {/* Recent Transactions */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Recent Transactions
                  </h2>
                  <div className="overflow-hidden rounded-lg">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700/50">
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">
                            Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">
                            Type
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {incomeExpense && incomeExpense?.length > 0 ? (
                          incomeExpense.slice(0, 5).map((item, index) => (
                            <tr
                              key={index}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                            >
                              <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white capitalize">
                                {item?.name}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                <div className="flex items-center gap-2">
                                  {formatCurrency(item?.amount)}
                                  {item.type === "income" ? (
                                    <FaArrowUp className="w-3 h-3 text-green-500" />
                                  ) : (
                                    <FaArrowDown className="w-3 h-3 text-red-500" />
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    item.type === "income"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                  }`}
                                >
                                  {item.type}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="3"
                              className="px-4 py-8 text-sm text-center text-gray-500 dark:text-gray-400"
                            >
                              No transactions available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Financial Forecast */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <FaRegCalendarAlt className="w-5 h-5 mr-2 text-purple-500" />
                    Financial Forecast
                  </h2>
                  <div className="overflow-hidden rounded-lg">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700/50">
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">
                            Month
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">
                            Projected Balance
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">
                            Projected Income
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">
                            Projected Expense
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {financialForecast?.length > 0 ? (
                          financialForecast.map((item, index) => (
                            <tr
                              key={index}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                            >
                              <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                                {item.month}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                {formatCurrency(item.projectedBalance)}
                              </td>
                              <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400">
                                {formatCurrency(item.projectedIncome)}{" "}
                                <FaArrowUp className="inline-block ml-1 text-green-500" />
                              </td>
                              <td className="px-4 py-3 text-sm text-red-600 dark:text-red-400">
                                {formatCurrency(item.projectedExpense)}{" "}
                                <FaArrowDown className="inline-block ml-1 text-red-500" />
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="4"
                              className="px-4 py-8 text-sm text-center text-gray-500 dark:text-gray-400"
                            >
                              No forecast data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Additional Stats/Cards */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Financial Health
                  </h2>
                  <div className="space-y-4">
                    {/* Savings Rate */}
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Savings Rate
                        </h3>
                        <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                          {summary?.savingRate
                            ? `${Math.round(summary.savingRate * 100)}%`
                            : "N/A"}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full"
                          style={{
                            width: summary?.savingRate
                              ? `${Math.min(
                                  Math.round(summary.savingRate * 100),
                                  100
                                )}%`
                              : "0%",
                          }}
                        ></div>
                      </div>
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        {summary?.savingRate >= 0.2
                          ? "Great job! Your savings rate is healthy."
                          : "Aim for at least 20% savings rate for financial security."}
                      </p>
                    </div>

                    {/* Top Spending Category */}
                    <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/10 dark:to-yellow-900/10 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Top Spending Category
                      </h3>
                      {summary?.topCategory ? (
                        <div className="flex items-center justify-between">
                          <span className="text-base font-medium text-gray-800 dark:text-gray-200 capitalize">
                            {summary.topCategory}
                          </span>
                          <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                            {formatCurrency(summary.topCategoryAmount)}
                          </span>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No spending data available
                        </p>
                      )}
                    </div>

                    {/* Month-over-Month Trend */}
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Monthly Spending Trend
                      </h3>
                      {summary?.monthlyTrend ? (
                        <div className="flex items-center">
                          {summary.monthlyTrend > 0 ? (
                            <>
                              <FaArrowUp className="text-red-500 mr-1" />
                              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                                {Math.abs(summary.monthlyTrend).toFixed(1)}%
                                increase from last month
                              </span>
                            </>
                          ) : (
                            <>
                              <FaArrowDown className="text-green-500 mr-1" />
                              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                {Math.abs(summary.monthlyTrend).toFixed(1)}%
                                decrease from last month
                              </span>
                            </>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Insufficient data for trend analysis
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
