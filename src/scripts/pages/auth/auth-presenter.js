import AuthApi from "../../data/auth-api";
import AuthView, { updateNavUser, resetNavUser } from "./auth-view";

class AuthPresenter {
  constructor() {
    this.initGoogleAuth();
  }

  async render() {
    return AuthView.render();
  }

  async afterRender() {
    AuthView.bindEvents();
    this.setupEventListeners();
  }

  initGoogleAuth() {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }

  setupEventListeners() {
    document.addEventListener('loginAttempt', (e) => {
      this.handleLogin(e.detail.email, e.detail.password);
    });

    document.addEventListener('registerAttempt', (e) => {
      this.handleRegister(e.detail.name, e.detail.email, e.detail.password);
    });

    document.addEventListener('googleAuthAttempt', () => {
      this.handleGoogleAuth();
    });
  }

  async handleLogin(email, password) {
  try {
    const { token } = await AuthApi.login(email, password);

    localStorage.setItem('authToken', token);
    localStorage.setItem('userEmail', email); // Simpan email untuk nav

    AuthView.showSuccess('Login successful!');
    updateNavUser(email); // Update navbar langsung setelah login

    setTimeout(() => {
      window.location.hash = '#/';
    }, 1500);
  } catch (error) {
    AuthView.showError('Login failed: ' + error.message);
  }
}

  async handleRegister(name, email, password) {
    try {
      await AuthApi.register(name, email, password);

      AuthView.showSuccess('Registration successful! Please login.');
      document.getElementById('login-tab').click();
    } catch (error) {
      AuthView.showError('Registration failed: ' + error.message);
    }
  }

  handleGoogleAuth() {
    try {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
          callback: this.handleGoogleResponse.bind(this)
        });

        window.google.accounts.id.prompt();
      } else {
        throw new Error('Google authentication service is not available');
      }
    } catch (error) {
      AuthView.showError('Google authentication failed: ' + error.message);
    }
  }

  handleGoogleResponse(response) {
    try {
      // Verifikasi token dengan backend Anda jika diperlukan
      console.log('Google auth response:', response);

      AuthView.showSuccess('Google authentication successful!');
      setTimeout(() => {
        window.location.hash = '#/';
      }, 1500);
    } catch (error) {
      AuthView.showError('Google authentication failed: ' + error.message);
    }
  }
}

export default AuthPresenter;
