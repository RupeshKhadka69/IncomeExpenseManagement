import configureAxios from "./ConfigureAxios";
const requests = configureAxios();

const GoalServices = {
  CreateGoal(data) {
    return requests.post("/goal/create-goal", data);
  },
  GetGoalList(page, limit) {
    return requests.get(`/goal/get-all-goal?page=${page}&limit=${limit}`);
  },
  GetGoalBudgetList() {
    return requests.get(`/goal/goals-budget-list`);
  },
  DeleteSigleGoal(id) {
    return requests.delete(`/goal/delete-goal/${id}`);
  },
  GetSingleGoal(id) {
    return requests.get(`/goal/get-single-goal/${id}`);
  },
  UpdateGoal(id, data) {
    return requests.patch(`/goal/update-goal/${id}`, data);
  },
  SearchGoalList(query) {
    return requests.get(`/goal/search-goal?search=${query}`);
  },
};

export default GoalServices;
