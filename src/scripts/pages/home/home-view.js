import "../../../styles/home.css";

const HomeView = {
    render() {
    return `
      <main id="main-content" class="home container" tabindex="-1">
        <div class="home-text">
          <h2>Selamat Datang di</h2>
          <h1>Pilahin</h1>
          <button id="start-button" class="start-button" aria-label="Mulai menggunakan Pilahin!">
            Mulai
          </button>
        </div>
        <img src="/images/inilogo.png" alt="Logo Pilahin" class="home-image" />
      </main>
    `;
    },

    bindEvents() {
        document.getElementById("start-button")?.addEventListener("click", () => {
            window.location.hash = '/about';
        })
    }
}

export default HomeView;