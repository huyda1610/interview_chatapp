import axiosClient from "./axiosClient";

const userAPI = {
  registerUser: (account) => {
    return axiosClient.post("users", account);
  },
  getUserInfo: () => {
    return axiosClient.get("user");
  },
  getAllUsers: (account) => {
    return axiosClient.get("users", account);
  },
  editUser: (account) => {
    return axiosClient.put("user", account);
  },
  deleteUser: (email) => {
    return axiosClient.delete(`users/${email}`);
  },
};

export default userAPI;
