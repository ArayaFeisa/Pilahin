import "../../../styles/change-password.css";
import AuthApi from "../../data/auth-api";

const ChangePasswordView = {
  async render() {
    return `
      <section class="auth-page">
        <div class="auth-container">
          <h1 class="auth-title">Change Password</h1>
          
          <form id="change-password-form" class="auth-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
              <label for="new-password">New Password</label>
              <input type="password" id="new-password" name="new-password" required>
            </div>
            
            <button type="submit" class="auth-button">Change Password</button>
          </form>
          
          <div class="auth-footer">
            <a href="#/" class="auth-link">Back</a>
          </div>
        </div>
      </section>
    `;
  },

  bindEvents() {
    const form = document.getElementById('change-password-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const newPassword = document.getElementById('new-password').value;
        
        try {
          // Here you would call your API to change the password
          // await AuthApi.changePassword(email, newPassword);
          alert('Password changed successfully!');
          window.location.hash = '#/auth';
        } catch (error) {
          alert(error.message);
        }
      });
    }
  }
};

export default ChangePasswordView;