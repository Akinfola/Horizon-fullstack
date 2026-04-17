import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  // Manual token handling removed. Browser will automatically send httpOnly cookies.
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const isAuthRoute = error.config?.url?.includes("/auth/login") || error.config?.url?.includes("/auth/register");
    if (error.response?.status === 401 && !isAuthRoute) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  register: (data: object) => api.post("/auth/register", data),
  me: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
  forgotPassword: (email: string) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token: string, data: object) =>
    api.post(`/auth/reset-password?token=${token}`, data),
};

export const accountsApi = {
  getAll: () => api.get("/accounts"),
  getById: (id: string) => api.get(`/accounts/${id}`),
  getTotalBalance: () => api.get("/accounts/total-balance"),
  create: (data: object) => api.post("/accounts", data),
};

export const transactionsApi = {
  getAll: (params?: { accountId?: string; page?: number; limit?: number }) =>
    api.get("/transactions", { params }),
  getRecent: (limit = 5) =>
    api.get("/transactions/recent", { params: { limit } }),
};

export const transfersApi = {
  create: (data: object) => api.post("/transfers", data),
};

export const cardsApi = {
  getAll: () => api.get("/cards"),
  freeze: (id: string) => api.patch(`/cards/${id}/freeze`),
  unfreeze: (id: string) => api.patch(`/cards/${id}/unfreeze`),
};

export const loansApi = {
  getAll: () => api.get("/loans"),
  apply: (data: object) => api.post("/loans/apply", data),
};

export const adminApi = {
  getStats: () => api.get("/admin/stats"),
  getUsers: (params?: object) => api.get("/admin/users", { params }),
  getTransactions: (params?: object) =>
    api.get("/admin/transactions", { params }),
};

export const usersApi = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data: object) => api.patch("/users/profile", data),
};

export default api;