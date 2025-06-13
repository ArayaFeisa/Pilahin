import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #currentPage = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (!this.#navigationDrawer.contains(event.target) && !this.#drawerButton.contains(event.target)) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  async renderPage() {
    try {
      const url = getActiveRoute();
      const page = routes[url];

      // Jika halaman tidak ditemukan, redirect ke /
      if (!page) {
        window.location.hash = '/';
        return;
      }

      // Hancurkan halaman sebelumnya
      if (this.#currentPage && typeof this.#currentPage.destroy === 'function') {
        this.#currentPage.destroy();
      }

      // Render dan afterRender halaman baru
      this.#content.innerHTML = await page.render();
      await page.afterRender();

      this.#currentPage = page;
    } catch (error) {
      console.error('Error rendering page:', error);
      this.#content.innerHTML = `<p style="text-align:center; color:red;">Terjadi kesalahan saat memuat halaman.</p>`;
    }
  }
}

export default App;
