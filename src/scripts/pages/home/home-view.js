import "../../../styles/home.css";

const HomeView = {
  render() {
    return `
      <section id="get-start" class="get-start">
        <div class="get-start-content">
          <h1 class="get-start-title">Classify your Waste</h1>
          <p class="get-start-subtitle">
            Pilah sampah Anda dari rumah, kapan saja, di mana saja — Lebih mudah hanya dengan satu klik. wlwuwluwlwulwuwlwulwulwulwulwuwlu
          </p>
          <button id="start-button" class="start-button" aria-label="Mulai menggunakan Pilahin!">
            Get Start
          </button>
        </div>
      </section>

      <section id="our-features" class="our-features">
        <h2 class="features-title">Our Features</h2>
        <p class="features-subtitle">Kami tidak hanya membuat platform, tapi menghadirkan solusi pintar untuk memilah sampah lewat teknologi, edukasi, dan kemudahan akses bagi semua.</p>
        <div class="features-cards">
          <div class="feature-card">
            <h3>Smart Waste</h3>
            <p>Praktis, cepat, dan bisa kamu lakukan langsung dari rumah.</p>
          </div>
          <div class="feature-card">
            <h3>Eco Education</h3>
            <p>Belajar jadi lebih seru lewat video dan artikel seputar lingkungan, daur ulang, dan gaya hidup berkelanjutan.</p>
          </div>
          <div class="feature-card">
            <h3>Recycle Near Mi</h3>
            <p>Cukup ketik lokasi, dan mulai berkontribusi langsung dari lingkungan sekitar.</p>
          </div>
          <div class="feature-card">
            <h3>Recycle Near Me</h3>
            <p>Cukup ketik lokasi, dan mulai berkontribusi langsung dari lingkungan sekitar.</p>
          </div>
          <div class="feature-card">
            <h3>resing</h3>
            <p>mbohhh.</p>
          </div>
        </div>
      </section>

      <section id="about-us" class="about-us">
        <div class="about-us-image">
          <img src="/images/about-us.png" alt="Tentang Pilahin" />
        </div>
        <div class="about-us-content">
          <h2 class="about-us-title">About Us</h2>
          <p class="about-us-subtitle">
            Pilahin adalah platform digital yang membantu masyarakat memilah sampah dengan mudah lewat teknologi AI. Kami juga menyediakan edukasi seputar lingkungan dan peta lokasi Bank Sampah untuk mendukung aksi nyata dari rumah. Semua dalam satu aplikasi yang praktis dan ramah pengguna.
          </p>
          <p class="about-us-subtitle">
            Misi kami adalah membangun kebiasaan ramah lingkungan yang inklusif dan berkelanjutan. Dengan Pilahin, kami percaya setiap orang bisa ikut berkontribusi menjaga bumi—mulai dari langkah kecil yang sederhana.
          </p>
          <p class="about-us-subtitle">
            yapyapyap gajelasss
          </p>

          <p class="about-us-subtitle">
            gastok
          </p>
        </div>
      </section>

      <section id="about-us" class="about-us">
        <div class="about-us-image">
          <img src="/images/about-us.png" alt="Tentang Pilahin" />
        </div>
        <div class="about-us-content">
          <h2 class="about-us-title">About Us</h2>
          <p class="about-us-subtitle">
            Pilahin adalah platform digital yang membantu masyarakat memilah sampah dengan
             mudah lewat teknologi AI. Kami juga menyediakan edukasi seputar lingkungan dan peta
             lokasi Bank Sampah untuk mendukung aksi nyata dari rumah. Semua dalam satu aplikasi 
             yang praktis dan ramah pengguna.
          </p>
        </div>
      </section>
    `;
  },

  bindEvents() {
    document.getElementById("start-button")?.addEventListener("click", () => {
      window.location.hash = "/scan";
    });
  },
};

export default HomeView;
