import CONFIG from "./pilahin-API";

const AuthApi = {
  async login(email, password) {
    const response = await fetch(`${CONFIG.BASE_URL}login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    if (response.ok && result.status === 'success') {
      return result.data;
    } else {
      throw new Error(result.message || 'Login failed');
    }
  },

  async register(name, email, password) {
    const response = await fetch(`${CONFIG.BASE_URL}register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    if (response.ok && result.status === 'success') {
      return result.data;
    } else {
      throw new Error(result.message || 'Registration failed');
    }
  }
};

export default AuthApi;