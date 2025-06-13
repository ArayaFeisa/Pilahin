import "../../../styles/scan.css";
import * as tf from '@tensorflow/tfjs'; // Import TensorFlow.js

const ScanView = {
  videoStream: null,
  videoElement: null,
  canvasElement: null,
  ctx: null,
  model: null,
  isPredicting: false,
  animationFrameId: null,
  classNames: ["Organik", "Non-Organik", "B3"], // Definisi classNames di sini

  render() {
    return `
      <section class="scan-page">
        <h1 class="scan-title">Pilah Sampahmu</h1>

        <div class="scan-image-container">
          <img src="/images/Trash_Bin.png" alt="Tempat Sampah Recycle" class="scan-image" />
        </div>

        <div class="scan-buttons">
          <button id="upload-button" class="scan-btn" aria-label="Upload gambar dari perangkat">Upload</button>
          <button id="camera-button" class="scan-btn" aria-label="Scan langsung lewat kamera">Scan</button>
          <button id="stop-camera-button" class="scan-btn" aria-label="Hentikan scan kamera" style="display: none;">Stop Scan</button>
        </div>

        <div class="scan-preview-container" id="scan-preview-container">
          </div>

        <button id="pilah-button" class="scan-btn pilah-btn" aria-label="Proses dan pilah sampah" style="display: none;">Pilah</button>

        <p id="result-text" class="scan-result-text">Hasil deteksi akan muncul di sini.</p>

        <input type="file" id="file-input" accept="image/*" style="display: none;" />
      </section>
    `;
  },

  async loadModel() {
    if (!this.model) {
      this.model = await window.tf.loadGraphModel('/model/model.json');
    }
  },

  async classifyImage() {
    if (!this.selectedImageElement || !this.model) {
      alert("Silakan upload gambar terlebih dahulu!");
      return;
    }

    const img = this.selectedImageElement;
    const tensor = window.tf.browser.fromPixels(img)
      .resizeNearestNeighbor([150, 150]) // sesuai input model
      .toFloat()
      .expandDims(0); // jadi batch [1, 150, 150, 3]

    const prediction = this.model.predict(tensor);
    const predictionData = await prediction.data();

    // Asumsi: output model adalah [organik, non organik, bahan berbahaya]
    const classes = ["Organik", "Non-Organik", "Bahan Berbahaya"];
    const maxIndex = predictionData.indexOf(Math.max(...predictionData));
    const label = classes[maxIndex];

    document.getElementById("result-text").innerText = `Hasil deteksi: ${label}`;
  },

  bindEvents() {
    const uploadButton = document.getElementById("upload-button");
    const cameraButton = document.getElementById("camera-button");
    const stopCameraButton = document.getElementById("stop-camera-button"); // New stop button
    const fileInput = document.getElementById("file-input");
    const previewContainer = document.getElementById("scan-preview-container");
    const resultText = document.getElementById("result-text");
    const pilahButton = document.getElementById("pilah-button");

    // Clear previous content in preview container
    previewContainer.innerHTML = '';

    // --- Inisialisasi Video dan Canvas Elements ---
    this.videoElement = document.createElement('video');
    this.videoElement.id = 'camera-preview';
    this.videoElement.autoplay = true;
    this.videoElement.playsInline = true;
    this.videoElement.style.maxWidth = '100%';
    this.videoElement.style.maxHeight = '100%';
    this.videoElement.style.display = 'none'; // Hidden by default

    this.canvasElement = document.createElement('canvas');
    this.canvasElement.id = 'detection-canvas';
    this.canvasElement.style.maxWidth = '100%';
    this.canvasElement.style.maxHeight = '100%';
    this.canvasElement.style.position = 'absolute'; // Position over video
    this.canvasElement.style.top = '0';
    this.canvasElement.style.left = '0';
    this.ctx = this.canvasElement.getContext('2d');

    // Add them to the container
    previewContainer.appendChild(this.videoElement);
    previewContainer.appendChild(this.canvasElement);

    // --- Fungsi Bantuan ---
    const stopVideoStream = () => {
      if (this.videoStream) {
        const tracks = this.videoStream.getTracks();
        tracks.forEach((track) => track.stop());
        this.videoStream = null;
      }
      if (this.videoElement) {
        this.videoElement.style.display = 'none';
        this.videoElement.srcObject = null;
      }
      if (this.canvasElement) {
        this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
        this.canvasElement.style.display = 'none';
      }
      this.isPredicting = false;
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null; // Reset animation frame ID
      }
      resultText.textContent = "Hasil deteksi akan muncul di sini.";
      pilahButton.style.display = 'none';
      cameraButton.style.display = 'inline-block'; // Show camera button again
      stopCameraButton.style.display = 'none'; // Hide stop button
    };
    this.stopVideoStream = stopVideoStream; // Export for presenter

    // --- Event Listeners ---

    // Upload Button Click
    uploadButton.addEventListener("click", () => {
      stopVideoStream();
      fileInput.click();
      pilahButton.style.display = 'block'; // Show Pilah button for upload
      cameraButton.style.display = 'inline-block'; // Ensure camera button is visible
      stopCameraButton.style.display = 'none'; // Hide stop button
    });

    // File input change
    fileInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          stopVideoStream(); // Stop camera if it was running
          const img = new Image();
          img.onload = () => {
            // Display uploaded image directly in the container, no canvas overlay yet
            previewContainer.innerHTML = ''; // Clear video/canvas
            img.style.maxWidth = '100%';
            img.style.maxHeight = '100%';
            img.style.display = 'block';
            previewContainer.appendChild(img);
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

    // Camera Button Click
    cameraButton.addEventListener("click", async () => {
      try {
        stopVideoStream(); // Stop any existing stream/prediction
        cameraButton.style.display = 'none'; // Hide camera button
        stopCameraButton.style.display = 'inline-block'; // Show stop button

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'environment' // Prefer rear camera on mobile
          }
        });
        this.videoStream = stream;
        this.videoElement.srcObject = stream;
        this.videoElement.style.display = 'block'; // Show video

        // Wait for video metadata to load
        await new Promise((resolve) => {
          this.videoElement.onloadedmetadata = () => {
            resolve();
          };
        });

        // Set canvas dimensions to match video
        this.canvasElement.width = this.videoElement.videoWidth;
        this.canvasElement.height = this.videoElement.videoHeight;
        this.canvasElement.style.display = 'block'; // Show canvas

        // Start prediction loop after model loads
        if (this.model) {
          this.isPredicting = true;
          this.predictWebcam();
          pilahButton.style.display = 'none'; // Hide pilah button for live scan
        } else {
          resultText.textContent = "Memuat model...";
          // The presenter will handle model loading and calling startPrediction
        }

      } catch (error) {
        console.error("Error accessing camera:", error);
        alert(`Tidak dapat mengakses kamera: ${error.message}. Pastikan izin kamera diberikan.`);
        stopVideoStream(); // Clean up if camera access fails
      }
    });

    // Stop Camera Button Click
    stopCameraButton.addEventListener('click', () => {
      stopVideoStream();
    });

    // Tombol Pilah
    pilahButton.addEventListener("click", async () => {
      await this.loadModel();
      await this.classifyImage();
    });

    window.addEventListener("beforeunload", stopVideoStream);
  },

  // --- Metode untuk Interaksi dengan Presenter ---
  // No need for setPredictionCallback here as predictWebcam is managed internally

  async predictWebcam() {
    if (!this.isPredicting || !this.videoElement || !this.model) {
      return;
    }

    // tf.tidy ensures that all intermediate tensors are disposed of
    const prediction = tf.tidy(() => {
// ... di dalam tf.tidy()
const webcamImage = tf.browser.fromPixels(this.videoElement);

// Define a central crop box (e.g., 50% of the video dimensions)
const videoWidth = this.videoElement.videoWidth;
const videoHeight = this.videoElement.videoHeight;

// Calculate crop dimensions
const cropSize = Math.min(videoWidth, videoHeight) * 0.7; // Example: 70% of the smaller dimension
const x1 = (videoWidth - cropSize) / 2;
const y1 = (videoHeight - cropSize) / 2;
const x2 = x1 + cropSize;
const y2 = y1 + cropSize;

// Crop the image
const croppedImage = webcamImage.slice([y1, x1, 0], [cropSize, cropSize, 3]);

const resized = tf.image.resizeBilinear(croppedImage, [150, 150]) // Model input size
                         .toFloat()
                         .div(tf.scalar(255)); // Normalize to [0, 1]
const expanded = resized.expandDims(0); // Add batch dimension

croppedImage.dispose(); // Don't forget to dispose the cropped tensor

const output = this.model.execute(expanded);
      return output;
    });

    const [classId, probability] = await this.processPrediction(prediction);

    // Dispose of the prediction tensor to free up memory
    if (prediction instanceof tf.Tensor) { // Check if it's a single tensor
      prediction.dispose();
    } else if (Array.isArray(prediction)) { // If it's an array of tensors
      prediction.forEach(t => t.dispose());
    }


    // Draw bounding box and label
    this.drawBoundingBoxAndLabel(classId, probability);

    // Request next animation frame
    this.animationFrameId = requestAnimationFrame(() => this.predictWebcam());
  },

  async processPrediction(prediction) {
    // If your GraphModel returns an array of tensors, find the one with probabilities
    // For a classification model, it's usually a single tensor.
    const outputTensor = Array.isArray(prediction) ? prediction[0] : prediction;

    const values = await outputTensor.data();
    const classId = values.indexOf(Math.max(...values));
    const probability = values[classId];
    return [this.classNames[classId], probability];
  },

  drawBoundingBoxAndLabel(label, score) {
    if (!this.ctx || !this.canvasElement) return;

    // Clear previous drawings
    this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

    // Draw bounding box for the whole frame
    this.ctx.strokeStyle = '#00FF00'; // Green color for box
    this.ctx.lineWidth = 4;
    this.ctx.strokeRect(0, 0, this.canvasElement.width, this.canvasElement.height); // Full frame box

    // Draw label background
    const fontSize = Math.max(16, this.canvasElement.width / 40); // Responsive font size
    this.ctx.font = `${fontSize}px Arial`;
    this.ctx.fillStyle = 'rgba(0, 255, 0, 0.7)'; // Green background for text with some transparency
    const text = `${label} (${(score * 100).toFixed(1)}%)`;
    const textWidth = this.ctx.measureText(text).width;
    const textHeight = fontSize + 8; // Padding for text background

    this.ctx.fillRect(0, 0, textWidth + 20, textHeight + 5); // Background rectangle, added padding

    // Draw label text
    this.ctx.fillStyle = '#000000'; // Black text
    this.ctx.fillText(text, 10, fontSize + 2); // Position text, added padding

    // Update result text
    document.getElementById("result-text").textContent = `Terdeteksi: ${text}`;
  },

  setModel(model) {
    this.model = model;
  },

  startPrediction() {
    if (this.videoElement && this.model && this.videoElement.srcObject) {
      this.isPredicting = true;
      this.predictWebcam();
    } else {
      console.warn("Video stream or model not ready to start prediction. Model:", this.model, "VideoStream:", this.videoElement.srcObject);
    }
  },

  // Export stopVideoStream for external use by presenter on component destroy
  stopVideoStream: null, // Initialized in bindEvents
};

export default ScanView;