import React from "react";
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
} from "chart.js";
import { Line } from "react-chartjs-2";
import { TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const HomeChart = ({ incomeExpense }) => {
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

    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        income: data.income,
        expense: data.expense,
      }))
      .sort((a, b) => {
        const months = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
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
    get savingsRate() {
      return ((this.netSavings / this.totalIncome) * 100).toFixed(1);
    }
  };

  // Enhanced chart configuration
  const chartData = {
    labels: monthlyTransactions.map((t) => t.month),
    datasets: [
      {
        label: "Income",
        data: monthlyTransactions.map((t) => t.income),
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgb(34, 197, 94)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Expense",
        data: monthlyTransactions.map((t) => t.expense),
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgb(239, 68, 68)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context) => {
            return ` ${context.dataset.label}: $${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          callback: (value) => `$${value.toLocaleString()}`,
          font: {
            size: 12
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Income</p>
              <h3 className="text-2xl font-bold text-green-700 dark:text-green-300 mt-1">
                {formatCurrency(financialSummary.totalIncome)}
              </h3>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600 dark:text-red-400">Total Expenses</p>
              <h3 className="text-2xl font-bold text-red-700 dark:text-red-300 mt-1">
                {formatCurrency(financialSummary.totalExpense)}
              </h3>
            </div>
            <TrendingDown className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Net Savings</p>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1">
                  {formatCurrency(financialSummary.netSavings)}
                </h3>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  ({financialSummary.savingsRate}%)
                </span>
              </div>
            </div>
            <PiggyBank className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="h-[400px]">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default HomeChart;