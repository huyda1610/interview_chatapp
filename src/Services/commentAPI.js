import axiosClient from "./axiosClient";

const commentAPI = {
  getComment: (slug) => {
    return axiosClient.get(`articles/${slug}/comments`);
  },
  createComment: (slug, body) => {
    return axiosClient.post(`articles/${slug}/comments`, {
      body: body,
    });
  },
  deleteComment: (slug, id) => {
    return axiosClient.delete(`articles/${slug}/comments/${id}`);
  },
};

export default commentAPI;
