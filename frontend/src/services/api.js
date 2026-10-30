import axios from "axios";

export const TOKEN_KEY = "tereverde_token";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000" });

// Interceptor: anexa o JWT em requisições de escrita (POST, PUT, PATCH, DELETE)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  const method = (config.method || "get").toLowerCase();
  if (token && ["post", "put", "patch", "delete"].includes(method)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Sessão expirada: limpa o token e volta para o login
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && localStorage.getItem(TOKEN_KEY) && !err.config.url.includes("/auth/login")) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const authService = {
  login: (email, senha) => api.post("/api/auth/login", { email, senha }).then((r) => r.data),
};

const crud = (base) => ({
  list: (params) => api.get(base, { params }).then((r) => r.data),
  get: (id) => api.get(`${base}/${id}`).then((r) => r.data),
  create: (data) => api.post(base, data).then((r) => r.data),
  update: (id, data) => api.put(`${base}/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`${base}/${id}`),
  toggle: (id) => api.patch(`${base}/${id}/disponibilidade`).then((r) => r.data),
});

export const atracoesService = crud("/api/atracoes");
export const eventosService = crud("/api/eventos");

export const errMsg = (e) => {
  const d = e.response?.data?.detail;
  if (Array.isArray(d)) return d.map((x) => x.msg).join("; ");
  return d || "Erro ao comunicar com a API";
};

export default api;
