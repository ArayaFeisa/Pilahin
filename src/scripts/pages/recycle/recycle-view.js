import "../../../styles/recycle.css";

const RecycleView = {
  render() {
    return `
      <section class="recycle-section container">
        <div class="recycle-left">
          <h1 class="recycle-title">Ayo cari bank sampah terdekatmu!</h1>
          <p class="recycle-subtitle">Bergabunglah dalam misi menjaga lingkungan dengan mendaur ulang sampah di bank sampah terdekat dari lokasi Anda</p>
          
          <div class="recycle-features">
            <div class="recycle-feature">
              <div class="recycle-feature-icon">📍</div>
              <span class="recycle-feature-text">Temukan bank sampah terdekat</span>
            </div>
            <div class="recycle-feature">
              <div class="recycle-feature-icon">♻️</div>
              <span class="recycle-feature-text">Daur ulang berbagai jenis sampah</span>
            </div>
            <div class="recycle-feature">
              <div class="recycle-feature-icon">🌱</div>
              <span class="recycle-feature-text">Kontribusi untuk lingkungan</span>
            </div>
            <div class="recycle-feature">
              <div class="recycle-feature-icon">💰</div>
              <span class="recycle-feature-text">Dapatkan rupiah dari sampah</span>
            </div>
          </div>
          
          <button id="locate-button" class="recycle-button">
            <span>🔍 Cari Lokasi Terdekat</span>
          </button>
        </div>
        <div class="recycle-right">
          <div class="map-header">
            <h3 class="map-title">Peta Bank Sampah</h3>
            <p class="map-subtitle">Klik pada marker untuk melihat detail bank sampah</p>
          </div>
          <div id="map-container"></div>
        </div>
      </section>
    `;
  },
};

export default RecycleView;