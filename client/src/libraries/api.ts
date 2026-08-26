import axios from "axios";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);

export default api;

export const fetchDashboardStats = async () => {
  const response = await axios.get(`${API_BASE}/analytics/dashboard`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data.data;
};

export const fetchScoreTrend = async (days: number = 30) => {
  const response = await axios.get(
    `${API_BASE}/analytics/score-trend?days=${days}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
  return response.data.data;
};

export const fetchLanguageBreakdown = async () => {
  const response = await axios.get(`${API_BASE}/analytics/languages`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data.data;
};

export const fetchSeverityBreakdown = async () => {
  const response = await axios.get(`${API_BASE}/analytics/severity`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data.data;
};

export const fetchTopIssues = async (limit: number = 5) => {
  const response = await axios.get(
    `${API_BASE}/analytics/top-issues?limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
  return response.data.data;
};

export const fetchReviewHistory = async (params: {
  page?: number;
  limit?: number;
  language?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  minScore?: number;
  maxScore?: number;
}) => {
  const response = await axios.get(`${API_BASE}/reviews`, {
    params,
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data.data;
};

export const deleteReview = async (id: string) => {
  const response = await axios.delete(`${API_BASE}/reviews/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return response.data.data;
};


