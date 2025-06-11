import "../../../styles/videos.css";

const VideosView = {
  async render() {
    // Fetch videos from YouTube API (example)
    const videos = await this.fetchVideos();
    
    return `
      <section class="videos-page">
        <div class="videos-header">
          <h1 class="videos-title">Educational Videos</h1>
          <p class="videos-subtitle">Learn about waste management and recycling through these informative videos</p>
        </div>
        
        <div class="videos-grid">
          ${videos.map(video => `
            <div class="video-card" data-id="${video.id}">
              <div class="video-thumbnail">
                <img src="${video.thumbnail}" alt="${video.title}" />
                <div class="play-button">▶</div>
              </div>
              <div class="video-content">
                <span class="video-source">${video.source}</span>
                <h3 class="video-title">${video.title}</h3>
                <p class="video-description">${video.description}</p>
                <span class="video-duration">${video.duration}</span>
              </div>
            </div>
          `).join('')}
        </div>
        
        <a href="#/education" class="back-button">Back to Education</a>
      </section>
    `;
  },

  async fetchVideos() {
    // contoh aja
    return [
      {
        id: '1',
        title: 'How to Properly Sort Your Waste',
        description: 'A comprehensive guide to sorting different types of waste for effective recycling',
        source: 'YouTube - Eco Channel',
        duration: '8:45',
        thumbnail: 'https://i.ytimg.com/vi/abc123/mqdefault.jpg',
        videoId: 'abc123'
      },
      {
        id: '2',
        title: 'DIY Composting at Home',
        description: 'Learn how to turn your kitchen waste into nutrient-rich compost for your garden',
        source: 'YouTube - Green Living',
        duration: '12:30',
        thumbnail: 'https://i.ytimg.com/vi/def456/mqdefault.jpg',
        videoId: 'def456'
      },
      // ntar ditambah x
    ];
  },

  bindEvents() {
    document.querySelectorAll('.video-card').forEach(card => {
      card.addEventListener('click', () => {
        const videoId = card.getAttribute('data-id');
        this.showVideoPlayer(videoId);
      });
    });
  },

  async showVideoPlayer(videoId) {
    const videos = await this.fetchVideos();
    const video = videos.find(v => v.id === videoId);
    
    const modal = document.createElement('div');
    modal.className = 'video-modal-overlay';
    modal.innerHTML = `
      <div class="video-modal-content">
        <button class="video-modal-close">&times;</button>
        <div class="video-container">
          <iframe src="https://www.youtube.com/embed/${video.videoId}?autoplay=1" allowfullscreen></iframe>
        </div>
        <div class="video-modal-body">
          <h2 class="video-modal-title">${video.title}</h2>
          <p class="video-modal-description">${video.description}</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    modal.querySelector('.video-modal-close').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
  }
};

export default VideosView;