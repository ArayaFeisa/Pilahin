import "../../../styles/auth.css";

const AuthView = {
  render() {
    return `
      <section class="auth-page">
        <div class="auth-container">
          <h1 class="auth-title">Welcome to Pilahin</h1>
          
          <div class="auth-tabs">
            <button class="auth-tab active" id="login-tab">Login</button>
            <button class="auth-tab" id="register-tab">Register</button>
          </div>
          
          <div class="auth-forms">
            <!-- Login Form -->
            <form id="login-form" class="auth-form active">
              <div class="form-group">
                <label for="login-email">Email</label>
                <input type="email" id="login-email" required>
              </div>
              <div class="form-group">
                <label for="login-password">Password</label>
                <input type="password" id="login-password" required>
              </div>
              <button type="submit" class="auth-btn">Login</button>
            </form>
            
            <!-- Register Form -->
            <form id="register-form" class="auth-form">
              <div class="form-group">
                <label for="register-name">Full Name</label>
                <input type="text" id="register-name" required>
              </div>
              <div class="form-group">
                <label for="register-email">Email</label>
                <input type="email" id="register-email" required>
              </div>
              <div class="form-group">
                <label for="register-password">Password</label>
                <input type="password" id="register-password" required>
              </div>
              <div class="form-group">
                <label for="register-confirm">Confirm Password</label>
                <input type="password" id="register-confirm" required>
              </div>
              <button type="submit" class="auth-btn">Register</button>
            </form>
          </div>
          
          <div class="auth-divider">
            <span>OR</span>
          </div>
          
          <button id="google-auth" class="google-auth-btn">
            <img src="/images/Google.png" alt="Google Logo" class="google-logo">
            Continue with Google
          </button>
        </div>
      </section>
    `;
  },

  bindEvents() {
    // Tab switching
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    loginTab.addEventListener('click', () => {
      loginTab.classList.add('active');
      registerTab.classList.remove('active');
      loginForm.classList.add('active');
      registerForm.classList.remove('active');
    });

    registerTab.addEventListener('click', () => {
      registerTab.classList.add('active');
      loginTab.classList.remove('active');
      registerForm.classList.add('active');
      loginForm.classList.remove('active');
    });

    // Form submissions
    document.getElementById('login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      // This will be handled in presenter
      document.dispatchEvent(new CustomEvent('loginAttempt', { 
        detail: { email, password } 
      }));
    });

    document.getElementById('register-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('register-name').value;
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;
      const confirmPassword = document.getElementById('register-confirm').value;
      
      if (password !== confirmPassword) {
        alert("Passwords don't match!");
        return;
      }
      
      // This will be handled in presenter
      document.dispatchEvent(new CustomEvent('registerAttempt', { 
        detail: { name, email, password } 
      }));
    });

    // Google auth button
    document.getElementById('google-auth').addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('googleAuthAttempt'));
    });
  },

  showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'auth-error';
    errorElement.textContent = message;
    
    const container = document.querySelector('.auth-container');
    const existingError = document.querySelector('.auth-error');
    
    if (existingError) {
      existingError.remove();
    }
    
    container.prepend(errorElement);
  },

  showSuccess(message) {
    const successElement = document.createElement('div');
    successElement.className = 'auth-success';
    successElement.textContent = message;
    
    const container = document.querySelector('.auth-container');
    const existingSuccess = document.querySelector('.auth-success');
    
    if (existingSuccess) {
      existingSuccess.remove();
    }
    
    container.prepend(successElement);
  }
};

export default AuthView;