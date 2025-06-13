import ScanView from "./scan-view";
import * as tf from '@tensorflow/tfjs';

export default class ScanPresenter {
  constructor() {
    this.model = null;
    // Path ke model Anda, perhatikan struktur direktorinya
    this.modelPath = "/tfjs_model/model.json";
  }

  async render() {
    return ScanView.render();
  }

  async afterRender() {
    ScanView.bindEvents();
    await this.loadModel(); // Muat model saat halaman dimuat
  }

  async loadModel() {
    try {
      if (!this.model) {
        document.getElementById("result-text").textContent = "Memuat model...";
        // *** PERUBAHAN KRITIS DI SINI ***
        // Gunakan tf.loadGraphModel() jika model Anda adalah GraphModel
        this.model = await tf.loadGraphModel(this.modelPath);
        console.log("Model loaded successfully:", this.model);
        document.getElementById("result-text").textContent = "Model siap! Klik 'Scan' untuk memulai.";
        ScanView.setModel(this.model); // Set model di ScanView
        // Jika kamera sudah aktif (misal dari navigasi sebelumnya), mulai prediksi
        if (ScanView.videoElement && ScanView.videoElement.srcObject && !ScanView.isPredicting) {
            ScanView.startPrediction();
        }
      }
    } catch (error) {
      console.error("Failed to load model:", error);
      document.getElementById("result-text").textContent = `Gagal memuat model: ${error.message}`;
      alert("Gagal memuat model TensorFlow.js. Pastikan file model ada di lokasi yang benar dan formatnya benar (GraphModel).");
    }
  }

  destroy() {
    // Pastikan untuk membuang model dan menghentikan video stream saat komponen dihancurkan
    if (this.model) {
      this.model.dispose();
      this.model = null;
      console.log("Model disposed.");
    }
    if (ScanView.stopVideoStream) {
      ScanView.stopVideoStream();
      console.log("Video stream stopped.");
    }
    // Hentikan juga loop prediksi jika masih berjalan
    ScanView.isPredicting = false;
    if (ScanView.animationFrameId) {
      cancelAnimationFrame(ScanView.animationFrameId);
    }
  }
}