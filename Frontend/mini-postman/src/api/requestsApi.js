import api from "./axios";

export const requestsApi = {
  // GET /requests - Get all requests for user
  getAll: async () => {
    const response = await api.get("/requests");
    return response.data;
  },

  // POST /requests - Create new request
  create: async (requestData) => {
    const response = await api.post("/requests", requestData);
    return response.data;
  },

  // DELETE /requests/:id - Delete request
  delete: async (id) => {
    const response = await api.delete(`/requests/${id}`);
    return response.data;
  },

  // POST /requests/:id/execute - Execute request
  execute: async (id) => {
    const response = await api.post(`/requests/${id}/execute`);
    return response.data;
  },

  // GET /requests/:id/executions - Get execution history
  getExecutions: async (id) => {
    const response = await api.get(`/requests/${id}/executions`);
    return response.data;
  },
};

export default requestsApi;