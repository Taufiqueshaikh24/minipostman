import api from "./api";

const environmentsService = {
  getAll: () => api.get("/environments"),
  create: (data) => api.post("/environments", data),
  update: (id, data) => api.put(`/environments/${id}`, data),
  delete: (id) => api.delete(`/environments/${id}`),
};

export default environmentsService;