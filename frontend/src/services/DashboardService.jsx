import configureAxios from "./ConfigureAxios";
const requests = configureAxios();

const DashboardService = {
  getIncomeExpense() {
    return requests.get("/dashboard/income-expense-list");
  },
  getSummary() {
    return requests.get("/dashboard/advice");
  },
  getForecast() {
    return requests.get("/dashboard/generate-forecast");
  },
};

export default DashboardService;
