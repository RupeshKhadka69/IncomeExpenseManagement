import configureAxios from "./ConfigureAxios";
const requests = configureAxios();

const IncomeServices = {
  CreateIncome(data) {
    return requests.post("/transcation/create-income", data);
  },
  GetIncomeList(page, limit) {
    return requests.get(
      `/transcation/get-all-income?page=${page}&limit=${limit}`
    );
  },
  DeleteSigleIncome(id) {
    return requests.delete(`/transcation/delete-income/${id}`);
  },
  GetSingleIncome(id) {
    return requests.get(`/transcation/get-single-income?id=${id}`);
  },
  UpdateIncome(id, data) {
    return requests.patch(`/transcation/update-income/${id}`, data);
  },
  SearchIncomeList(query){
    return requests.get(`/transcation/search-income?search=${query}`);
  }
};

export default IncomeServices;
