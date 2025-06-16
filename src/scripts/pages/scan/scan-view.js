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
  classNames: ["Organik, masukkan ke tempat sampah kategori organik ya!🟩", 
    "Non-organik? Jangan asal buang, ini bisa didaur ulang!🟨",
    "B3 terdeteksi! Pisahkan, simpan dan buang ke tempat sampah b3 ya..🟥"],

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
    const stopCameraButton = document.getElementById("stop-camera-button");
    const fileInput = document.getElementById("file-input");
    const previewContainer = document.getElementById("scan-preview-container");
    const resultText = document.getElementById("result-text");
    const pilahButton = document.getElementById("pilah-button");

    previewContainer.innerHTML = '';

    this.videoElement = document.createElement('video');
    this.videoElement.id = 'camera-preview';
    this.videoElement.autoplay = true;
    this.videoElement.playsInline = true;
    this.videoElement.style.maxWidth = '100%';
    this.videoElement.style.maxHeight = '100%';
    this.videoElement.style.display = 'none';

    this.canvasElement = document.createElement('canvas');
    this.canvasElement.id = 'detection-canvas';
    this.canvasElement.style.maxWidth = '100%';
    this.canvasElement.style.maxHeight = '100%';
    this.canvasElement.style.position = 'absolute';
    this.canvasElement.style.top = '0';
    this.canvasElement.style.left = '0';
    this.ctx = this.canvasElement.getContext('2d');

    previewContainer.appendChild(this.videoElement);
    previewContainer.appendChild(this.canvasElement);

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
        this.animationFrameId = null;
      }
      resultText.textContent = "Hasil deteksi akan muncul di sini.";
      pilahButton.style.display = 'none';
      cameraButton.style.display = 'inline-block';
      stopCameraButton.style.display = 'none';
    };
    this.stopVideoStream = stopVideoStream;

    // --- Event Listeners ---
    uploadButton.addEventListener("click", () => {
  stopVideoStream();
  fileInput.value = "";
  previewContainer.innerHTML = "";
  this.selectedImageElement = null;
  resultText.textContent = "Silakan pilih gambar untuk diproses.";
  fileInput.click();
});


    fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      stopVideoStream();
      const img = new Image();
      img.onload = () => {
  previewContainer.innerHTML = '';
  img.style.maxWidth = '100%';
  img.style.maxHeight = '100%';
  img.style.display = 'block';
  previewContainer.appendChild(img);

  this.selectedImageElement = img;
  resultText.textContent = "Gambar siap! Klik 'Pilah' untuk klasifikasi.";
  pilahButton.style.display = 'block';
};

      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

    cameraButton.addEventListener("click", async () => {
  try {
    stopVideoStream();

previewContainer.innerHTML = '';
previewContainer.appendChild(this.videoElement);
previewContainer.appendChild(this.canvasElement);

cameraButton.style.display = 'none';
stopCameraButton.style.display = 'inline-block';


    await this.loadModel();

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

    stopCameraButton.addEventListener('click', () => {
      stopVideoStream();
      previewContainer.innerHTML = '';
this.selectedImageElement = null;
resultText.textContent = "Mengaktifkan kamera...";

    });

    pilahButton.addEventListener("click", async () => {
      await this.loadModel();
      await this.classifyImage();
    });

    window.addEventListener("beforeunload", stopVideoStream);
  },

  // --- Metode untuk Interaksi dengan Presenter ---
  async predictWebcam() {
    if (!this.isPredicting || !this.videoElement || !this.model) {
      return;
    }

    const prediction = tf.tidy(() => {
const webcamImage = tf.browser.fromPixels(this.videoElement);

const videoWidth = this.videoElement.videoWidth;
const videoHeight = this.videoElement.videoHeight;

const cropSize = Math.min(videoWidth, videoHeight) * 0.7;
const x1 = (videoWidth - cropSize) / 2;
const y1 = (videoHeight - cropSize) / 2;
const x2 = x1 + cropSize;
const y2 = y1 + cropSize;

// Crop the image
const croppedImage = webcamImage.slice([y1, x1, 0], [cropSize, cropSize, 3]);

const resized = tf.image.resizeBilinear(croppedImage, [150, 150]) // Model input size
                         .toFloat()
                         .div(tf.scalar(255));
const expanded = resized.expandDims(0); // Add batch dimension

croppedImage.dispose();

const output = this.model.execute(expanded);
      return output;
    });

    const [classId, probability] = await this.processPrediction(prediction);

    if (prediction instanceof tf.Tensor) {
      prediction.dispose();
    } else if (Array.isArray(prediction)) {
      prediction.forEach(t => t.dispose());
    }

    this.drawBoundingBoxAndLabel(classId, probability);

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

    this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

    this.ctx.strokeStyle = '#00FF00';
    this.ctx.lineWidth = 4;
    this.ctx.strokeRect(0, 0, this.canvasElement.width, this.canvasElement.height)

    // Draw label background
    const fontSize = Math.max(16, this.canvasElement.width / 40);
    this.ctx.font = `${fontSize}px Arial`;
    this.ctx.fillStyle = 'rgba(0, 255, 0, 0.7)';
    const text = `${label} (${(score * 100).toFixed(1)}%)`;
    const textWidth = this.ctx.measureText(text).width;
    const textHeight = fontSize + 8;

    this.ctx.fillRect(0, 0, textWidth + 20, textHeight + 5);

    // Draw label text
    this.ctx.fillStyle = '#000000';
    this.ctx.fillText(text, 10, fontSize + 2);

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

  stopVideoStream: null,
};

export default ScanView;