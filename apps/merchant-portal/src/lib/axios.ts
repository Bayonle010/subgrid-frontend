import axios from "axios";

const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("auth-store");
        const token = raw ? JSON.parse(raw)?.state?.user?.accessToken : null;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        // corrupted storage — skip attaching token
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginEndpoint = error.config?.url?.includes("/login");
    if (error.response?.status === 401 && !isLoginEndpoint) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth-store");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export { apiClient };
