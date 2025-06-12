import AuthView from "./auth-view";

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
    // Load Google API client library
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
      // Here call your backend API
      // for now contoh aja
      console.log('Login attempt with:', email, password);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // On successful login
      AuthView.showSuccess('Login successful!');
      // Redirect to home page after a delay
      setTimeout(() => {
        window.location.hash = '#/';
      }, 1500);
    } catch (error) {
      AuthView.showError('Login failed: ' + error.message);
    }
  }

  async handleRegister(name, email, password) {
    try {
      // Here you  call your backend API
      console.log('Register attempt with:', name, email, password);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // On successful registration
      AuthView.showSuccess('Registration successful! Please login.');
      // Switch to login tab
      document.getElementById('login-tab').click();
    } catch (error) {
      AuthView.showError('Registration failed: ' + error.message);
    }
  }

  handleGoogleAuth() {
    try {
      // Initialize Google Auth
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
      // Here you  verify the credential with your backend
      console.log('Google auth response:', response);
      
      // Simulate successful authentication
      AuthView.showSuccess('Google authentication successful!');
      
      // Redirect to home page after a delay
      setTimeout(() => {
        window.location.hash = '#/';
      }, 1500);
    } catch (error) {
      AuthView.showError('Google authentication failed: ' + error.message);
    }
  }
}

export default AuthPresenter;