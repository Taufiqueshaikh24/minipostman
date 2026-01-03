import api from "./axios";

export const collectionsApi = {
  // GET /collections - Get all collections
  getAll: async () => {
    const response = await api.get("/collections");
    return response.data;
  },

  // POST /collections - Create new collection
  create: async (name) => {
    const response = await api.post("/collections", { name });
    return response.data;
  },

  // POST /collections/:collectionId/requests/:requestId - Add request to collection
  addRequest: async (collectionId, requestId) => {
    const response = await api.post(
      `/collections/${collectionId}/requests/${requestId}`
    );
    return response.data;
  },

  // DELETE /collections/:id - Delete collection (if implemented)
  delete: async (id) => {
    const response = await api.delete(`/collections/${id}`);
    return response.data;
  },
};

export default collectionsApi;