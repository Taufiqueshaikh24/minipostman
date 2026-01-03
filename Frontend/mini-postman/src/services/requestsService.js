import api from "./api";

const requestsService = {
  getAll: () => api.get("/requests"),
  create: (data) => api.post("/requests", data),
  delete: (id) => api.delete(`/requests/${id}`),
  execute: (id, environmentId) => {
    const url = environmentId 
      ? `/requests/${id}/execute?environmentId=${environmentId}`
      : `/requests/${id}/execute`;
    return api.post(url);
  },
  getExecutions: (id) => api.get(`/requests/${id}/executions`),
};

export default requestsService;