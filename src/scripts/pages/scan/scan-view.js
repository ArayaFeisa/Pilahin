import "../../../styles/scan.css";
import * as tf from '@tensorflow/tfjs';

const ScanView = {
  videoStream: null,
  videoElement: null,
  canvasElement: null,
  ctx: null,
  model: null,
  isPredicting: false,
  animationFrameId: null,
  selectedImageElement: null,
  classNames: ["Organik", "Non-Organik", "B3"],

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
  const tensor = tf.browser.fromPixels(img)
    .resizeNearestNeighbor([150, 150])
    .toFloat()
    .expandDims(0);

  const prediction = this.model.predict(tensor);
  const predictionData = await prediction.data();

  const maxIndex = predictionData.indexOf(Math.max(...predictionData));
  const label = this.classNames[maxIndex] || "Tidak Dikenali";

  document.getElementById("result-text").innerText = `Hasil deteksi: ${label}`;

  if (prediction.dispose) prediction.dispose();
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
        previewContainer.innerHTML = '';
this.selectedImageElement = null;

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
  fileInput.value = ""; // Reset input agar bisa pilih file yg sama dua kali
  previewContainer.innerHTML = ""; // Pastikan container bersih sebelum upload baru
  this.selectedImageElement = null; // Reset
  resultText.textContent = "Silakan pilih gambar untuk diproses.";
  fileInput.click();
});


    // File input change
    fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      stopVideoStream(); // Hentikan kamera
      const img = new Image();
      img.onload = () => {
  previewContainer.innerHTML = '';
  img.style.maxWidth = '100%';
  img.style.maxHeight = '100%';
  img.style.display = 'block';
  previewContainer.appendChild(img);

  this.selectedImageElement = img;
  resultText.textContent = "Gambar siap! Klik 'Pilah' untuk klasifikasi.";
  pilahButton.style.display = 'block'; // Tampilkan tombol pilah segera
};

      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});


    // Camera Button Click
    cameraButton.addEventListener("click", async () => {
  try {
    stopVideoStream();

// Tambahkan ulang elemen video & canvas ke DOM
previewContainer.innerHTML = '';
previewContainer.appendChild(this.videoElement);
previewContainer.appendChild(this.canvasElement);

cameraButton.style.display = 'none';
stopCameraButton.style.display = 'inline-block';


    await this.loadModel(); // Pastikan model sudah dimuat sebelum lanjut

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'environment',
      },
    });

    this.videoStream = stream;
    this.videoElement.srcObject = stream;
    this.videoElement.style.display = 'block';

    await new Promise((resolve) => {
      this.videoElement.onloadedmetadata = () => {
        resolve();
      };
    });

    this.canvasElement.width = this.videoElement.videoWidth;
    this.canvasElement.height = this.videoElement.videoHeight;
    this.canvasElement.style.display = 'block';

    this.isPredicting = true;
    this.predictWebcam();
    pilahButton.style.display = 'none';
  } catch (error) {
    console.error("Error accessing camera:", error);
    alert(`Tidak dapat mengakses kamera: ${error.message}`);
    stopVideoStream();
  }
});


    // Stop Camera Button Click
    stopCameraButton.addEventListener('click', () => {
      stopVideoStream();
      previewContainer.innerHTML = ''; // Bersihkan sisa gambar upload
this.selectedImageElement = null;
resultText.textContent = "Mengaktifkan kamera...";

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
  const outputTensor = Array.isArray(prediction) ? prediction[0] : prediction;
  const values = await outputTensor.data();

  if (!values || values.length === 0) return ["Tidak Dikenali", 0];

  const maxIdx = values.indexOf(Math.max(...values));
  const label = this.classNames[maxIdx] || "Tidak Dikenali";
  return [label, values[maxIdx]];
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