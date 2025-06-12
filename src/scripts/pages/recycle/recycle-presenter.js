// src/scripts/pages/recycle/recycle-presenter.js
import RecycleView from "./recycle-view";

export default class RecyclePresenter {
  async render() {
    return RecycleView.render();
  }

  async afterRender() {
    const locateBtn = document.getElementById('locate-button');
    const mapContainer = document.getElementById('map-container');

    // Inisialisasi peta
    const map = L.map(mapContainer).setView([-2.5489, 118.0149], 5); // Fokus awal: Indonesia
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    let userMarker;

    locateBtn.addEventListener('click', () => {
      if (!navigator.geolocation) {
        alert('Geolocation tidak didukung browser ini.');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          map.setView([latitude, longitude], 14);

          if (userMarker) {
            map.removeLayer(userMarker);
          }

          userMarker = L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup('Lokasi kamu sekarang.')
            .openPopup();

          // Simulasi bank sampah (sementara karena belum ada API)
          const mockBanks = [
            { name: 'Bank Sampah Induk Malang', lat: latitude + 0.01, lng: longitude + 0.01 },
            { name: 'Bank Sampah RW 03', lat: latitude - 0.01, lng: longitude - 0.01 },
          ];

          mockBanks.forEach((bank) => {
            L.marker([bank.lat, bank.lng])
              .addTo(map)
              .bindPopup(bank.name);
          });
        },
        () => {
          alert('Gagal mendapatkan lokasi. Pastikan akses lokasi diizinkan.');
        }
      );
    });
  }
}
