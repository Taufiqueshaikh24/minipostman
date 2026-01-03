import api from "./api";

const authService = {
  signup: (email, password) => api.post("/auth/signup", { email, password }),
  login: (email, password) => api.post("/auth/login", { email, password }),
  logout: () => api.post("/auth/logout"),
  checkAuth: () => api.get("/auth/me"),
};

export default authService;