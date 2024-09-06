import axios from "axios";

const configureAxios = () => {
  const instance = axios.create({
    baseURL: "http://localhost:8000/",
    withCredentials: true,
  });

  let isRefreshing = false;
  let failedQueue = [];

  const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    failedQueue = [];
  };

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({resolve, reject});
          }).then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return instance(originalRequest);
          }).catch(err => {
            return Promise.reject(err);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        return new Promise((resolve, reject) => {
          instance.post('/user/refresh-token')
            .then(({data}) => {
              const newToken = data.jwtToken;  // Adjust this based on your API response
              instance.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
              originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
              processQueue(null, newToken);
              resolve(instance(originalRequest));
            })
            .catch((err) => {
              processQueue(err, null);
              reject(err);
            })
            .finally(() => {
              isRefreshing = false;
            });
        });
      }

      if (error.response.status === 401 && window.location.pathname !== "/login/") {
        setTimeout(() => {
          window.location = "/login/";
        }, 3000);
      }

      return Promise.reject(error);
    }
  );

  const responseBody = (response) => (response && response.data) || null;

  const requests = {
    get: (url, params, headers) => instance.get(url, { params, headers }).then(responseBody),
    post: (url, body, headers) => instance.post(url, body, { headers }).then(responseBody),
    put: (url, body, headers) => instance.put(url, body, { headers }).then(responseBody),
    patch: (url, body, headers) => instance.patch(url, body, { headers }).then(responseBody),
    delete: (url, params, headers) => instance.delete(url, { params, headers }).then(responseBody),
  };

  return requests;
};

export default configureAxios;