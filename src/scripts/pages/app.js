import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #currentPage = null; // Untuk melacak halaman aktif

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

    // Jika ada halaman aktif sebelumnya, panggil destroy()
    if (this.#currentPage && typeof this.#currentPage.destroy === 'function') {
      this.#currentPage.destroy();
    }

    // Tangani jika halaman tidak ditemukan
    if (!page) {
      window.location.hash = '/';
      return;
    }

    // Render hanya sekali!
    this.#content.innerHTML = await page.render();
    await page.afterRender();

    this.#currentPage = page;
  } catch (error) {
    console.error('Error rendering page:', error);
  }
}

}

export default App;
