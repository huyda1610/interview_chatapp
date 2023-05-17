import axiosClient from "./axiosClient";

const loginAPI = {
  login : (account) => {
    return axiosClient.post("login",account);
  },
};

export default loginAPI;