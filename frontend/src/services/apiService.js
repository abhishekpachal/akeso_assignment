const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiService = {
  get: async (endpoint) => {
    const token = localStorage.getItem("token");
    const result = await fetch(`${BASE_API_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    if (result.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
      return;
    }
    return result;
  },

  post: async (endpoint, data) => {
    const token = localStorage.getItem("token");
    const result = await fetch(`${BASE_API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(data),
    });
    if (result.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
      return;
    }
    return result;
  },
};

export default apiService;
