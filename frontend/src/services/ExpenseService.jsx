import configureAxios from "./ConfigureAxios";
const requests = configureAxios();

const ExpenseServices = {
  CreateExpense(data) {
    return requests.post("/transcation/create-expense", data);
  },
  GetExpenseList(page, limit) {
    return requests.get(
      `/transcation/get-all-expense?page=${page}&limit=${limit}`
    );
  },
  GetSingleExpense(id) {
    return requests.get(`/transcation/get-single-expense?id=${id}`);
  },
  UpdateExpense(id,data) {
    return requests.patch(`/transcation/update-expense?id=${id}`,data);
  },
   
};

export default ExpenseServices;
