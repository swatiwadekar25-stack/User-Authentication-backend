const AuthApi = (() => {
  const BASE_URL = "http://localhost:5000/api/auth";
  const TOKEN_KEY = "authToken";

  function getToken() {
    return sessionStorage.getItem(TOKEN_KEY) ||
      localStorage.getItem(TOKEN_KEY);
  }

  function saveToken(token, remember) {
    clearToken();
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(TOKEN_KEY, token);
  }

  function clearToken() {
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }

  async function request(path, { token, ...options } = {}) {
    const headers = new Headers(options.headers || {});
    if (options.body) {
      headers.set("Content-Type", "application/json");
    }
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    let response;
    try {
      response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers
      });
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error("Cannot connect to the server. Please try again.");
      }
      throw error;
    }

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error("The server returned an invalid response.");
    }

    if (!response.ok) {
      throw new Error(data.message || "The request could not be completed.");
    }
    return data;
  }

  return {
    clearToken,
    getToken,
    login: (credentials) => request("/login", {
      method: "POST",
      body: JSON.stringify(credentials)
    }),
    register: (details) => request("/register", {
      method: "POST",
      body: JSON.stringify(details)
    }),
    saveToken,
    getMe: (token) => request("/me", { token })
  };
})();