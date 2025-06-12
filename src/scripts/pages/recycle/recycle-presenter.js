import RecycleView from "./recycle-view";
import OverpassAPI from "../../data/api";

export default class RecyclePresenter {
  #map = null;
  #markerGroup = null;
  #userMarker = null;

  async render() {
    return RecycleView.render();
  }

  async afterRender() {
    const locateBtn = document.getElementById("locate-button");
    const mapContainer = document.getElementById("map-container");

    this.#map = L.map(mapContainer).setView([-2.5489, 118.0149], 5); // Fokus peta Indonesia
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#markerGroup = L.layerGroup().addTo(this.#map);

    locateBtn.addEventListener("click", async () => {
      if (!navigator.geolocation) {
        alert("Geolocation tidak didukung browser ini.");
        return;
      }

      locateBtn.disabled = true;
      locateBtn.textContent = "Memuat lokasi...";

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          this.#map.setView([latitude, longitude], 14);

          if (this.#userMarker) {
            this.#map.removeLayer(this.#userMarker);
          }

          this.#userMarker = L.marker([latitude, longitude])
            .addTo(this.#map)
            .bindPopup("Lokasimu sekarang")
            .openPopup();

          // Bersihkan marker sebelumnya
          this.#markerGroup.clearLayers();

          try {
            const banks = await OverpassAPI.fetchNearbyWasteBanks({ lat: latitude, lon: longitude });

            if (banks.length === 0) {
              alert("Tidak ditemukan bank sampah di sekitar lokasi Anda.");
            }

            banks.forEach((bank) => {
  L.marker([bank.lat, bank.lon])
    .addTo(this.#markerGroup)
    .bindPopup(`<b>${bank.name}</b><br><pre>${JSON.stringify(bank.tags, null, 2)}</pre>`);
});

          } catch (error) {
            console.error(error);
            alert("Gagal memuat data bank sampah. Coba lagi nanti.");
          }

          locateBtn.disabled = false;
          locateBtn.textContent = "Recycle Lagi";
        },
        (error) => {
          console.error("Gagal mendapatkan lokasi:", error);
          alert("Gagal mendapatkan lokasi. Pastikan akses lokasi diizinkan.");
          locateBtn.disabled = false;
          locateBtn.textContent = "Recycle";
        }
      );
    });
  }

  destroy() {
    if (this.#map) {
      this.#map.remove();
      this.#map = null;
      this.#markerGroup = null;
      this.#userMarker = null;
    }
  }
}
