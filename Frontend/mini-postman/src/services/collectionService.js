import api from "./api";

const collectionsService = {
  getAll: () => api.get("/collections"),
  create: (name) => api.post("/collections", { name }),
  addRequest: (collectionId, requestId) => 
    api.post(`/collections/${collectionId}/requests/${requestId}`),
};

export default collectionsService;