import axiosClient from "./axiosClient";

const articleAPI = {
  getAllArticles: () => {
    return axiosClient.get("articles");
  },
  getArticle: (slug) => {
    return axiosClient.get(`articles/${slug}`);
  },
  createArticle: (body) => {
    return axiosClient.post("articles", body);
  },
  updateArticle: (slug, body) => {
    return axiosClient.put(`articles/${slug}`, body);
  },
  deleteArticle: (slug) => {
    return axiosClient.delete(`articles/${slug}`);
  },
};

export default articleAPI;
