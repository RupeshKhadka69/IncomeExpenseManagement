import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminServices from "../services/AdminService";
import { useNavigate } from "react-router-dom";
import DashboardService from "../services/DashboardService";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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
  const logout = async () => {
    try {
      const res = await AdminServices.logout();
      console.log("res", res);
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  // Utility function to convert full date to month abbreviation
  const formatDateToMonthAbbr = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("default", { month: "short" });
  };

  // Utility function to group transactions by month
  const groupTransactionsByMonth = (transactions) => {
    const monthlyData = {};

    transactions?.forEach((transaction) => {
      const monthAbbr = formatDateToMonthAbbr(transaction.date);

      if (!monthlyData[monthAbbr]) {
        monthlyData[monthAbbr] = {
          income: 0,
          expense: 0,
        };
      }

      if (transaction?.type === "income") {
        monthlyData[monthAbbr].income += transaction.amount;
      } else if (transaction?.type === "expense") {
        monthlyData[monthAbbr].expense += transaction.amount;
      }
    });

    // Convert to array and sort by chronological order
    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        income: data.income,
        expense: data.expense,
      }))
      .sort((a, b) => {
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        return months.indexOf(a.month) - months.indexOf(b.month);
      });
  };

  const monthlyTransactions = groupTransactionsByMonth(incomeExpense);

  // Calculate financial summary
  const financialSummary = {
    totalIncome: monthlyTransactions.reduce((sum, t) => sum + t.income, 0),
    totalExpense: monthlyTransactions.reduce((sum, t) => sum + t.expense, 0),
    get netSavings() {
      return this.totalIncome - this.totalExpense;
    },
  };

  // Chart configuration
  const chartData = {
    labels: monthlyTransactions.map((t) => t.month),
    datasets: [
      {
        label: "Income",
        data: monthlyTransactions.map((t) => t.income),
        borderColor: "green",
        backgroundColor: "rgba(0, 255, 0, 0.1)",
        tension: 0.3,
      },
      {
        label: "Expense",
        data: monthlyTransactions.map((t) => t.expense),
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.1)",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Income vs Expense",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Amount ($)",
        },
      },
    },
  };

  return (
    <div className="text-black">
      {isLoading ? "loading" : ""}
      Home sdvsdvsdddddddddd
      <button type="button" onClick={logout}>
        logout
      </button>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Financial Overview</h1>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-100 p-4 rounded">
            <h2 className="text-lg font-semibold">Total Income</h2>
            <p className="text-2xl text-green-600">
              ${financialSummary.totalIncome.toLocaleString()}
            </p>
          </div>
          <div className="bg-red-100 p-4 rounded">
            <h2 className="text-lg font-semibold">Total Expense</h2>
            <p className="text-2xl text-red-600">
              ${financialSummary.totalExpense.toLocaleString()}
            </p>
          </div>
          <div className="bg-blue-100 p-4 rounded">
            <h2 className="text-lg font-semibold">Net Savings</h2>
            <p className="text-2xl text-blue-600">
              ${financialSummary.netSavings.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Chart Container */}
        <div className="h-[400px] w-full">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Home;
