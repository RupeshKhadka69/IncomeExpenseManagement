import axios from "axios";

const configureAxios = () => {
  const instance = axios.create({
    baseURL: "http://localhost:8000/",
    withCredentials: true,
  });

  const errorHandler = (error) => {
    console.log("error",error)
    if (
      error?.response?.status === 401 &&
      window.location.pathname !== "/login/"
    ) {
      // notifyError(error ? error.response?.data?.message : error.message);
      setTimeout(() => {
        // const language = localStorage.getItem("lang");
        // const cards = localStorage.getItem("card");
        // const officeDetails = localStorage.getItem("off_det");
        // const email = localStorage.getItem("email");
        localStorage.clear();
        // localStorage.setItem("lang", language);
        // localStorage.setItem("card", cards);
        // localStorage.setItem("off_det", officeDetails);
        // localStorage.setItem("email", email);
        window.location = "/login/";
      }, 3000);
    }
    return Promise.reject(error);
  };
  // checking response after request
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return errorHandler(error);
    }
  );

  // handling response data
  const responseBody = (response) => (response && response.data) || null;


  // different types of request handling
  const requests = {
    get: (url, body, headers) => {
      return instance.get(url, body, headers).then(responseBody);
    },

    post: (url, body, headers) => {
      return instance.post(url, body, headers).then(responseBody);
    },

    put: (url, body, headers) => {
      return instance.put(url, body, headers).then(responseBody);
    },

    patch: (url, body, headers) => {
      return instance.patch(url, body, headers).then(responseBody);
    },

    delete: (url, body, headers) => {
      return instance.delete(url, body, headers).then(responseBody);
    },
  };

  return requests;
};

export default configureAxios;