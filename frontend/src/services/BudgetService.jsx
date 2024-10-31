import configureAxios from "./ConfigureAxios";
const requests = configureAxios();

const BudgetServices = {
  CreateBudget(data) {
    return requests.post("/budget/create-budget", data);
  },
  GetBudgetList(page, limit) {
    return requests.get(`/budget/get-all-budget?page=${page}&limit=${limit}`);
  },
  DeleteSigleBudget(id) {
    return requests.delete(`/budget/delete-budget/${id}`);
  },
  GetSingleBudget(id) {
    return requests.get(`/budget/get-single-budget/${id}`);
  },
  UpdateBudget(id, data) {
    return requests.patch(`/budget/update-budget/${id}`, data);
  },
  SearchBudgetList(query) {
    return requests.get(`/budget/search-budget?search=${query}`);
  },
};

export default BudgetServices;
