import "../../../styles/education.css";
import { localArticles } from "../../data/data-articles";
import { localVideos } from "../../data/data-videos";

// API Configuration
const API_CONFIG = {
  NEWS_API_KEY: '7a32c925962241139c4944adc150c2b9',
  YOUTUBE_API_KEY: 'AIzaSyD7nU8LN81uEHs32qBCRvNwaPvxXWnNuTc', 
  NEWS_API_URL: 'https://newsapi.org/v2/everything',
  YOUTUBE_API_URL: 'https://www.googleapis.com/youtube/v3/search'
};

const EducationView = {
  async render() {
    try {
      // Fetch data from APIs with fallback to local data
      const articles = await this.fetchArticles().catch((error) => {
        console.error('Using local articles due to API error:', error);
        return localArticles.slice(0, 3);
      });

      const videos = await this.fetchVideos().catch((error) => {
        console.error('Using local videos due to API error:', error);
        return localVideos.slice(0, 3);
      });

      return `
        <section id="eco-education" class="eco-education">
          <div class="eco-education-content">
            <div class="eco-education-image">
              <img src="/images/ecoedu.png" alt="Eco Education" />
            </div>
            <div class="eco-education-text">
              <h2 class="eco-education-title">Eco Education</h2>
              <p class="eco-education-description">
                Tingkatkan wawasan lingkunganmu lewat berbagai video edukatif dan artikel menarik 
                tentang pemilahan sampah dan daur ulang. Semua dirancang untuk pembelajaran mudah.
              </p>
            </div>
          </div>
        </section>

        <section id="articles-news" class="articles-news">
          <div class="section-header">
            <h2 class="section-title">Article and News</h2>
            <div class="section-underline"></div>
            <p class="section-subtitle">Artikel tentang pemilahan sampah dan daur ulang</p>
          </div>
          
          <div class="articles-grid">
            ${articles.slice(0, 3).map(article => `
              <article class="article-card">
                <img src="${article.urlToImage || article.image || '/images/default-article.jpg'}" 
                     alt="${article.title}" 
                     class="article-image" 
                     onerror="this.src='/images/default-article.jpg'" />
                <div class="article-content">
                  <h3 class="article-title">${article.title}</h3>
                  <p class="article-excerpt">${article.description || article.content || 'Artikel tentang pemilahan sampah dan daur ulang'}</p>
                  <div class="article-footer">
                    <span class="article-date">${new Date(article.publishedAt || article.date || new Date()).toLocaleDateString('id-ID')}</span>
                    <a href="${article.url || '#'}" target="_blank" rel="noopener noreferrer" class="see-detail-link">Lihat Detail →</a>
                  </div>
                </div>
              </article>
            `).join('')}
          </div>

          <div class="see-more-container">
            <button id="see-more-articles" class="see-more-btn">Lihat Lebih Banyak</button>
          </div>
        </section>

        <section id="videos" class="videos">
          <div class="section-header">
            <h2 class="section-title">Videos</h2>
            <div class="section-underline"></div>
            <p class="section-subtitle">Video edukasi pemilahan sampah profesional</p>
          </div>
          
          <div class="videos-grid">
            ${videos.slice(0, 3).map(video => `
              <div class="video-card" data-video-id="${video.id?.videoId || video.videoId || ''}">
                <div class="video-thumbnail">
                  <img src="${video.snippet?.thumbnails?.medium?.url || video.thumbnail || '/images/default-video.jpg'}" 
                       alt="${video.snippet?.title || video.title}"
                       onerror="this.src='/images/default-video.jpg'"/>
                  <div class="play-button">▶</div>
                </div>
                <div class="video-content">
                  <h3 class="video-title">${video.snippet?.title || video.title}</h3>
                  <p class="video-description">${video.snippet?.description || video.description || 'Video edukasi pemilahan sampah'}</p>
                  <div class="video-footer">
                    <a href="https://www.youtube.com/watch?v=${video.id?.videoId || video.videoId || ''}" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       class="see-detail-link">Tonton di YouTube →</a>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="see-more-container">
            <button id="see-more-videos" class="see-more-btn">Lihat Lebih Banyak</button>
          </div>
        </section>

        <!-- Modal for video playback -->
        <div id="video-modal" class="content-modal">
          <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div id="modal-body"></div>
          </div>
        </div>
      `;
    } catch (error) {
      console.error('Error rendering education view:', error);
      return `
        <section class="error-section">
          <h2>Error Loading Content</h2>
          <p>Sorry, we couldn't load the educational content. Please try again later.</p>
        </section>
      `;
    }
  },

  async fetchArticles() {
    try {
      // More focused query for Indonesian waste management content
      const query = 'pemilahan+sampah+OR+daur+ulang+OR+recycling+OR+"zero+waste"+language:id';
      const response = await fetch(
        `${API_CONFIG.NEWS_API_URL}?q=${query}&sortBy=relevancy&pageSize=3&apiKey=${API_CONFIG.NEWS_API_KEY}`
      );
      
      if (!response.ok) throw new Error(`News API request failed with status ${response.status}`);
      
      const data = await response.json();
      
      if (!data.articles) {
        console.log('No articles found in API response, using local data');
        return localArticles.slice(0, 3);
      }
      
      // Simple relevance filtering
      const filteredArticles = data.articles.filter(article => {
        const title = article.title?.toLowerCase() || '';
        const description = article.description?.toLowerCase() || '';
        return (title.includes('sampah') || 
               title.includes('daur ulang') || 
               title.includes('recycling') ||
               title.includes('zero waste') ||
               description.includes('sampah') ||
               description.includes('daur ulang'));
      });
      
      return filteredArticles.slice(0, 3);
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error; // Throw to trigger local fallback
    }
  },

  async fetchVideos() {
    try {
      // Focused query for professional Indonesian waste management videos
      const query = 'pemilahan+sampah+OR+daur+ulang+OR+recycling+OR+"zero+waste"+bahasa+indonesia';
      const response = await fetch(
        `${API_CONFIG.YOUTUBE_API_URL}?part=snippet&maxResults=3&q=${query}&type=video&videoDuration=medium&key=${API_CONFIG.YOUTUBE_API_KEY}`
      );
      
      if (!response.ok) throw new Error(`YouTube API request failed with status ${response.status}`);
      
      const data = await response.json();
      
      if (!data.items) {
        console.log('No videos found in API response, using local data');
        return localVideos.slice(0, 3);
      }
      
      // Simple quality filtering
      const filteredVideos = data.items.filter(video => {
        const title = video.snippet?.title?.toLowerCase() || '';
        const description = video.snippet?.description?.toLowerCase() || '';
        return !title.includes('anak') && 
               !title.includes('kartun') &&
               (title.includes('sampah') || 
                title.includes('daur ulang') ||
                title.includes('recycling') ||
                description.includes('sampah') ||
                description.includes('daur ulang'));
      });
      
      return filteredVideos.slice(0, 3);
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw error; // Throw to trigger local fallback
    }
  },

  bindEvents() {
    // Article card click - open external URL
    document.querySelectorAll('.article-card').forEach(card => {
      const link = card.querySelector('.see-detail-link');
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.see-detail-link')) {
          window.open(link.href, '_blank', 'noopener,noreferrer');
        }
      });
    });

    // Video card click - show modal with video player
    document.querySelectorAll('.video-card').forEach(card => {
      const videoId = card.getAttribute('data-video-id');
      if (videoId) {
        card.addEventListener('click', (e) => {
          if (!e.target.closest('.see-detail-link')) {
            this.showVideoModal({
              videoId: videoId,
              title: card.querySelector('.video-title')?.textContent || '',
              description: card.querySelector('.video-description')?.textContent || ''
            });
          }
        });
      }
    });

    // See more buttons
    document.getElementById('see-more-articles')?.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.hash = '/article';
    });

    document.getElementById('see-more-videos')?.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.hash = '/videos';
    });

    // Modal close button
    document.querySelector('.close-modal')?.addEventListener('click', () => {
      this.hideModal();
    });

    // Close modal when clicking outside
    document.getElementById('video-modal')?.addEventListener('click', (e) => {
      if (e.target === document.getElementById('video-modal')) {
        this.hideModal();
      }
    });

    // Close modal with ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideModal();
      }
    });
  },

  showVideoModal(content) {
    const modal = document.getElementById('video-modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
      <div class="video-container">
        <iframe width="100%" height="400" 
                src="https://www.youtube.com/embed/${content.videoId}?autoplay=1" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen></iframe>
      </div>
      <h2>${content.title}</h2>
      ${content.description ? `<p class="video-description">${content.description}</p>` : ''}
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  },

  hideModal() {
    const modal = document.getElementById('video-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Stop any playing videos
    const iframe = document.querySelector('.video-container iframe');
    if (iframe) {
      iframe.src = '';
    }
  },

  afterRender() {
    this.bindEvents();
  }
};

export default EducationView;