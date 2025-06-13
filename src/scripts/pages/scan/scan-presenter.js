import ScanView from "./scan-view";
import * as tf from '@tensorflow/tfjs';

export default class ScanPresenter {
  constructor() {
    this.model = null;
    this.modelPath = "/tfjs_model/model.json";
  }

  async render() {
    return ScanView.render();
  }

  async afterRender() {
    ScanView.bindEvents();
    await this.loadModel();
  }

  async loadModel() {
    try {
      if (!this.model) {
        document.getElementById("result-text").textContent = "Memuat model...";

        // Gunakan GraphModel jika menggunakan format .json dari tensorflow.js converter
        this.model = await tf.loadGraphModel(this.modelPath);

        console.log("Model loaded successfully:", this.model);
        document.getElementById("result-text").textContent = "Model siap! Klik 'Scan' untuk memulai.";

        ScanView.setModel(this.model);

        // Mulai prediksi hanya jika kamera aktif
        if (
          ScanView.videoElement &&
          ScanView.videoElement.srcObject &&
          !ScanView.isPredicting
        ) {
          ScanView.startPrediction();
        }
      }
    } catch (error) {
      console.error("Failed to load model:", error);
      document.getElementById("result-text").textContent = `Gagal memuat model: ${error.message}`;
      alert("Gagal memuat model TensorFlow.js. Periksa lokasi dan format model.");
    }
  }

  destroy() {
    if (this.model) {
      this.model.dispose();
      this.model = null;
      console.log("Model disposed.");
    }

    if (ScanView.stopVideoStream) {
      ScanView.stopVideoStream();
      console.log("Video stream stopped.");
    }

    if (ScanView.animationFrameId) {
      cancelAnimationFrame(ScanView.animationFrameId);
    }

    ScanView.isPredicting = false;
  }
}
