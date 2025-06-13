import '../styles/styles.css';

import App from './pages/app';
import { updateNavUser, resetNavUser } from './pages/auth/auth-view.js';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  // Render awal
  await app.renderPage();
  handleNavbarUser();

  // Re-render saat navigasi hash berubah
  window.addEventListener('hashchange', async () => {
    await app.renderPage();
    handleNavbarUser();
  });
});

function handleNavbarUser() {
  const storedEmail = localStorage.getItem('userEmail');
  if (storedEmail) {
    updateNavUser(storedEmail);
  } else {
    resetNavUser();
  }
}
