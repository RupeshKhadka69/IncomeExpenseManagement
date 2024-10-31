import configureAxios from "./ConfigureAxios";
const requests = configureAxios();

const DashboardService = {
  getIncomeExpense() {
    return requests.get("/dashboard/income-expense-list");
  },
};

export default DashboardService;
