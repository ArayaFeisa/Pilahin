import "../../../styles/article.css";

const ArticlesView = {
  async render() {
    // Fetch articles from NewsAPI (example)
    const articles = await this.fetchArticles();
    
    return `
      <section class="articles-page">
        <div class="articles-header">
          <h1 class="articles-title">Article and News</h1>
          <p class="articles-subtitle">Stay updated with the latest news and articles about waste management and environmental protection</p>
        </div>
        
        <div class="articles-grid">
          ${articles.map(article => `
            <article class="article-card" data-id="${article.id}">
              <img src="${article.image}" alt="${article.title}" class="article-image" />
              <div class="article-content">
                <span class="article-source">${article.source}</span>
                <h3 class="article-title">${article.title}</h3>
                <p class="article-excerpt">${article.excerpt}</p>
                <span class="article-date">${article.date}</span>
              </div>
            </article>
          `).join('')}
        </div>
        
        <a href="#/education" class="back-button">Back to Education</a>
      </section>
    `;
  },

  async fetchArticles() {
    // contoh aja
    return [
      {
        id: '1',
        title: 'How to Reduce Plastic Waste in Your Daily Life',
        excerpt: 'Practical tips for minimizing plastic usage and proper recycling methods to help the environment.',
        source: 'Eco News Network',
        date: 'May 15, 2024',
        image: 'https://images.unsplash.com/photo-1585011650347-c59dbef5f732',
        url: 'https://example.com/article1'
      },
      {
        id: '2',
        title: 'The Future of Waste Management: Smart Solutions',
        excerpt: 'Exploring innovative technologies that are transforming how we handle and process waste globally.',
        source: 'Green Tech Magazine',
        date: 'May 12, 2024',
        image: 'https://images.unsplash.com/photo-1503596476-1c12a8ba09a9',
        url: 'https://example.com/article2'
      },
      // ntar ditambah (x)
    ];
  },

  bindEvents() {
    document.querySelectorAll('.article-card').forEach(card => {
      card.addEventListener('click', () => {
        const articleId = card.getAttribute('data-id');
        this.showArticleDetail(articleId);
      });
    });
  },

  async showArticleDetail(articleId) {
    const articles = await this.fetchArticles();
    const article = articles.find(a => a.id === articleId);
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <img src="${article.image}" alt="${article.title}" class="modal-image" />
        <div class="modal-body">
          <h2 class="modal-title">${article.title}</h2>
          <p class="modal-text">${article.excerpt}</p>
          <p class="modal-text">This is a detailed view of the article. In a real implementation, you would fetch the full content from the source.</p>
          <span class="modal-source">Source: ${article.source}</span>
          <a href="${article.url}" target="_blank" class="external-link">Read Full Article</a>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    modal.querySelector('.modal-close').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
  }
};

export default ArticlesView;