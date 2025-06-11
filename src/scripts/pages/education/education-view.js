import "../../../styles/education.css";

const EducationView = {
  render() {
    return `
      <section id="eco-education" class="eco-education">
        <div class="eco-education-content">
          <div class="eco-education-image">
            <img src="/images/eco-education.png" alt="Eco Education" />
          </div>
          <div class="eco-education-text">
            <h2 class="eco-education-title">Eco Education</h2>
            <p class="eco-education-description">
              Tingkatkan wawasan lingkunganmu lewat berbagai video edukatif dan artikel menarik 
              yang kami sediakan. Semua dirancang agar kamu bisa belajar dengan mudah, di 
              mana saja, kapan saja — mulai dari hal sederhana hingga isu penting seputar 
              pengelolaan sampah.
            </p>
          </div>
        </div>
      </section>

      <section id="articles-news" class="articles-news">
        <div class="section-header">
          <h2 class="section-title">Article and News</h2>
          <div class="section-underline"></div>
        </div>
        
        <div class="articles-grid">
          <article class="article-card">
            <img src="/images/article-1.jpg" alt="Daur Ulang Plastik" class="article-image" />
            <div class="article-content">
              <h3 class="article-title">Tips Daur Ulang Plastik di Rumah</h3>
              <p class="article-excerpt">Pelajari cara mudah mendaur ulang plastik bekas menjadi barang berguna untuk rumah tangga Anda.</p>
              <span class="article-date">15 Mei 2024</span>
            </div>
          </article>

          <article class="article-card">
            <img src="/images/article-2.jpg" alt="Kompos Organik" class="article-image" />
            <div class="article-content">
              <h3 class="article-title">Membuat Kompos dari Sampah Organik</h3>
              <p class="article-excerpt">Panduan lengkap mengubah sampah dapur menjadi pupuk organik yang berkualitas tinggi.</p>
              <span class="article-date">12 Mei 2024</span>
            </div>
          </article>

          <article class="article-card">
            <img src="/images/article-3.jpg" alt="Zero Waste" class="article-image" />
            <div class="article-content">
              <h3 class="article-title">Gaya Hidup Zero Waste untuk Pemula</h3>
              <p class="article-excerpt">Mulai hidup tanpa sampah dengan langkah-langkah sederhana yang bisa diterapkan sehari-hari.</p>
              <span class="article-date">10 Mei 2024</span>
            </div>
          </article>

          <article class="article-card">
            <img src="/images/article-4.jpg" alt="Sampah Elektronik" class="article-image" />
            <div class="article-content">
              <h3 class="article-title">Mengelola Sampah Elektronik dengan Benar</h3>
              <p class="article-excerpt">Cara aman membuang dan mendaur ulang perangkat elektronik bekas untuk melindungi lingkungan.</p>
              <span class="article-date">8 Mei 2024</span>
            </div>
          </article>

          <article class="article-card">
            <img src="/images/article-5.jpg" alt="Sampah Kaca" class="article-image" />
            <div class="article-content">
              <h3 class="article-title">Kreativitas dengan Sampah Kaca</h3>
              <p class="article-excerpt">Ide-ide kreatif mengubah botol dan wadah kaca bekas menjadi dekorasi rumah yang menarik.</p>
              <span class="article-date">5 Mei 2024</span>
            </div>
          </article>

          <article class="article-card">
            <img src="/images/article-6.jpg" alt="Edukasi Anak" class="article-image" />
            <div class="article-content">
              <h3 class="article-title">Mengajarkan Anak Peduli Lingkungan</h3>
              <p class="article-excerpt">Tips efektif mengenalkan konsep pengelolaan sampah dan cinta lingkungan pada anak-anak.</p>
              <span class="article-date">3 Mei 2024</span>
            </div>
          </article>
        </div>

        <div class="see-more-container">
          <button id="see-more-articles" class="see-more-btn">See more</button>
        </div>
      </section>

      <section id="videos" class="videos">
        <div class="section-header">
          <h2 class="section-title">Videos</h2>
          <div class="section-underline"></div>
        </div>
        
        <div class="videos-grid">
          <div class="video-card">
            <div class="video-thumbnail">
              <img src="/images/video-1.jpg" alt="Video Tutorial Daur Ulang" />
              <div class="play-button">▶</div>
            </div>
            <div class="video-content">
              <h3 class="video-title">Tutorial Daur Ulang Botol Plastik</h3>
              <p class="video-description">Belajar membuat pot tanaman dari botol plastik bekas dalam 5 menit</p>
              <span class="video-duration">5:32</span>
            </div>
          </div>

          <div class="video-card">
            <div class="video-thumbnail">
              <img src="/images/video-2.jpg" alt="Video Kompos" />
              <div class="play-button">▶</div>
            </div>
            <div class="video-content">
              <h3 class="video-title">Cara Membuat Kompos Rumahan</h3>
              <p class="video-description">Panduan lengkap membuat kompos dari sampah organik dapur</p>
              <span class="video-duration">8:15</span>
            </div>
          </div>

          <div class="video-card">
            <div class="video-thumbnail">
              <img src="/images/video-3.jpg" alt="Video Pilah Sampah" />
              <div class="play-button">▶</div>
            </div>
            <div class="video-content">
              <h3 class="video-title">Pemilahan Sampah yang Benar</h3>
              <p class="video-description">Mengenal jenis-jenis sampah dan cara memilahnya dengan tepat</p>
              <span class="video-duration">6:45</span>
            </div>
          </div>

          <div class="video-card">
            <div class="video-thumbnail">
              <img src="/images/video-4.jpg" alt="Video Zero Waste" />
              <div class="play-button">▶</div>
            </div>
            <div class="video-content">
              <h3 class="video-title">Hidup Zero Waste di Kota Besar</h3>
              <p class="video-description">Tips praktis menjalani gaya hidup zero waste di lingkungan urban</p>
              <span class="video-duration">12:20</span>
            </div>
          </div>

          <div class="video-card">
            <div class="video-thumbnail">
              <img src="/images/video-5.jpg" alt="Video DIY" />
              <div class="play-button">▶</div>
            </div>
            <div class="video-content">
              <h3 class="video-title">DIY Tas Belanja dari Koran Bekas</h3>
              <p class="video-description">Kreasi unik membuat tas belanja ramah lingkungan dari koran bekas</p>
              <span class="video-duration">7:30</span>
            </div>
          </div>

          <div class="video-card">
            <div class="video-thumbnail">
              <img src="/images/video-6.jpg" alt="Video Edukasi" />
              <div class="play-button">▶</div>
            </div>
            <div class="video-content">
              <h3 class="video-title">Dampak Sampah Plastik pada Laut</h3>
              <p class="video-description">Dokumenter singkat tentang dampak sampah plastik terhadap ekosistem laut</p>
              <span class="video-duration">9:45</span>
            </div>
          </div>
        </div>

        <div class="see-more-container">
          <button id="see-more-videos" class="see-more-btn">See more</button>
        </div>
      </section>
    `;
  },

  bindEvents() {
    // Article card click events
    document.querySelectorAll('.article-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const title = card.querySelector('.article-title').textContent;
        console.log(`Clicked article: ${title}`);
        // You can add navigation to article detail page here
      });
    });

    // Video card click events
    document.querySelectorAll('.video-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const title = card.querySelector('.video-title').textContent;
        console.log(`Clicked video: ${title}`);
        // You can add video player functionality here
      });
    });

    // See more buttons
    document.getElementById('see-more-articles')?.addEventListener('click', (e) => {
      console.log('Load more articles');
      // Add logic to load more articles
      e.preventDefault();
      window.location.hash = '/article';
    });

    document.getElementById('see-more-videos')?.addEventListener('click', (e) => {
      console.log('Load more videos');
      // Add logic to load more videos
      e.preventDefault();
      window.location.hash = '/videos';
    });
  },
};

export default EducationView;