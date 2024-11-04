import React from "react";
import { useQuery } from "@tanstack/react-query";
import AdminServices from "../services/AdminService";
import { useNavigate } from "react-router-dom";
import DashboardService from "../services/DashboardService";
import Loading from "../utils/Loading";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import HomeChart from "./HomeChart";

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
  const { data: summary } = useQuery({
    queryFn: () => DashboardService.getSummary(),
    queryKey: ["get-financial-summary"],
    select: (d) => d?.data,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg  shadow">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="grid grid-cols-[1.2fr_0.8fr] gap-6 max-w-[1600px] mx-auto">
        {/* Main Content Column */}
        <div className="space-y-6">
          {/* Header Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Financial Overview
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Track your financial performance and insights
            </p>
          </div>

          {/* Chart Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <HomeChart incomeExpense={incomeExpense} />
          </div>

          {/* Suggestions Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Suggestions
              </h2>
              <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded"/>
            </div>
            <div className="space-y-3">
              {summary?.suggestions && summary.suggestions.length > 0 ? (
                summary.suggestions.map((data, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-500/10 text-blue-500 rounded-full text-sm font-semibold">
                        {index + 1}
                      </span>
                      <p className="font-medium text-gray-700 dark:text-gray-200">
                        {data}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400">
                    No suggestions available at this time
                  </p>
                </div>
              )}
            </div>
          </div>
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
                  {summary?.fiveRecentTransaction?.length > 0 ? (
                    summary.fiveRecentTransaction.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white capitalize">
                          {item.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex items-center gap-2">
                            {item.amount}
                            {item.type === "income" ? (
                              ""
                              // <ArrowUpCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              ""
                              // <ArrowDownCircle className="w-4 h-4 text-red-500" />
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

          {/* Insights Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Insights
              </h2>
              <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded"/>
            </div>
            <div className="space-y-4">
              {summary?.insights?.length > 0 ? (
                summary.insights.map((data, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                  >
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-500/10 text-blue-500 rounded-full text-sm font-semibold">
                      {index + 1}
                    </span>
                    <p className="font-medium text-gray-700 dark:text-gray-200">
                      {data}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400">
                    No insights available at the moment
                  </p>
                </div>
              )}
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
