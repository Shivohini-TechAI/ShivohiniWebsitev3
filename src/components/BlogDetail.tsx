import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Article {
  date: string;
  title: string;
  description: string;
  content: string;
  url?: string;
  fullContent?: string;
  source?: {
    name: string;
  };
  urlToImage?: string;
  author?: string;
  publishedAt?: string;
}

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Array of specific AI/computer-related images (no human subjects)
  const aiImages = [
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop', // Quantum computing
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop', // AI neural network visualization
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop', // Computer motherboard
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop', // Data center servers
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop', // Laptop with code
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop', // Robot arm
    'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&h=400&fit=crop', // Binary code background
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop', // Technology abstract
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop', // AI brain visualization
    'https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=800&h=400&fit=crop', // Circuit board
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop', // Digital circuit board
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop', // AI data visualization
    'https://images.unsplash.com/photo-1517134191118-9d595e4c8c2b?w=800&h=400&fit=crop', // Server room
    'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=400&fit=crop', // Coding on laptop
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop', // Robotic arm
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop', // Digital abstract
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop', // Neural network

  ];
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fullContentLoading, setFullContentLoading] = useState<boolean>(false);
  const [articles, setArticles] = useState<Article[]>([]);

  // Function to format date as Today, Yesterday, or Day before yesterday
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const dayBeforeYesterday = new Date(today);
    dayBeforeYesterday.setDate(today.getDate() - 2);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else if (date.toDateString() === dayBeforeYesterday.toDateString()) {
      return 'Day before yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  useEffect(() => {
    // Load articles from localStorage
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = `news_${today}`;

    let articles: Article[] = [];
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      articles = JSON.parse(cachedData);
    } else {
      // Fallback to yesterday's data if today's data is not available
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const yesterdayCacheKey = `news_${yesterday}`;
      const yesterdayData = localStorage.getItem(yesterdayCacheKey);
      if (yesterdayData) {
        articles = JSON.parse(yesterdayData);
      }
    }

    setArticles(articles);
    const articleIndex = parseInt(id || '0');
    if (articles[articleIndex]) {
      const selectedArticle = articles[articleIndex];
      setArticle(selectedArticle);

      // For all articles (AI-generated or external), format the content directly
      // Skip external fetching to avoid CORS issues
      const formattedContent = selectedArticle.content
        .split('\n\n')
        .filter(paragraph => paragraph.trim().length > 0)
        .map(paragraph => `<p style="color: white; margin: 0 0 1em 0; line-height: 1.8; font-size: 1em; font-weight: 400; text-align: justify;">${paragraph.trim()}</p>`)
        .join('');

      const fullContent = `
        <div style="margin-bottom: 2.5em; padding: 2em; background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%); border-radius: 16px; border-left: 5px solid #3b82f6; box-shadow: 0 8px 32px rgba(0,0,0,0.3); position: relative; overflow: hidden;">
          <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #3b82f6, #06b6d4, #3b82f6);"></div>
          <div style="padding-top: 0.5em;">
            ${formattedContent}
          </div>
          <div style="position: absolute; bottom: -10px; right: -10px; width: 40px; height: 40px; background: #3b82f6; border-radius: 50%; opacity: 0.1;"></div>
        </div>
      `;
      setArticle(prev => prev ? { ...prev, fullContent } : null);
    } else {
      setError('Article not found');
    }
    setLoading(false);
  }, [id]);

  // Function to fetch full article content from URL
  const fetchFullArticleContent = async (url: string) => {
    setFullContentLoading(true);
    try {
      // Try multiple CORS proxies in order of preference
      const proxies = [
        'https://cors-anywhere.herokuapp.com/',
        'https://api.codetabs.com/v1/proxy?quest=',
        'https://thingproxy.freeboard.io/fetch/'
      ];

      let data: { contents: string } | null = null;
      let success = false;

      for (const proxy of proxies) {
        try {
          const proxyUrl = `${proxy}${url}`;
          const response = await fetch(proxyUrl);

          if (response.ok) {
            const responseText = await response.text();
            data = { contents: responseText };
            success = true;
            break;
          }
        } catch (proxyError) {
          console.warn(`Proxy ${proxy} failed:`, proxyError);
          continue;
        }
      }

      if (!success) {
        throw new Error('All CORS proxies failed');
      }

      if (data && data.contents) {
        // Extract text content from HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');

        // Remove scripts, styles, and unwanted elements
        const scripts = doc.querySelectorAll('script, style, nav, header, footer, aside, .ad, .advertisement, .sidebar');
        scripts.forEach(element => element.remove());

        // Try to find main content areas
        const contentSelectors = [
          'article',
          '[data-testid="article-body"]',
          '.article-body',
          '.post-content',
          '.entry-content',
          '.content',
          'main',
          '.story-body',
          '.article-content'
        ];

        let mainContent = '';
        for (const selector of contentSelectors) {
          const element = doc.querySelector(selector);
          if (element && element.textContent && element.textContent.length > 200) {
            mainContent = element.textContent;
            break;
          }
        }

        // Fallback to body content if no specific content area found
        if (!mainContent) {
          const body = doc.querySelector('body');
          if (body) {
            mainContent = body.textContent || '';
          }
        }

        // Clean up the content
        mainContent = mainContent
          .replace(/\s+/g, ' ')
          .replace(/\n\s*\n/g, '\n')
          .trim();

        // Split into paragraphs and filter out short/empty ones
        const paragraphs = mainContent
          .split('\n')
          .map(p => p.trim())
          .filter(p => p.length > 30); // Lower threshold to capture more content

        // Collect all chunks from all paragraphs
        const allChunks = [];
        for (const p of paragraphs) {
          const sentences = p.split(/[.!?]+/).filter(s => s.trim().length > 10);
          for (let i = 0; i < sentences.length; i += 2) {
            allChunks.push(sentences.slice(i, i + 2).join('. ').trim() + (i + 2 < sentences.length ? '.' : ''));
          }
        }

        // Limit to 15 chunks total for more content
        const limitedChunks = allChunks.slice(0, 15);

        if (limitedChunks.length > 0) {
          const paragraphContent = limitedChunks.map(chunk => `<p style="color: white; margin: 0 0 1em 0; line-height: 1.8; font-size: 1em; font-weight: 400; text-align: justify;">${chunk}</p>`).join('');

          const fullContent = `
            <div style="margin-bottom: 2.5em; padding: 2em; background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%); border-radius: 16px; border-left: 5px solid #3b82f6; box-shadow: 0 8px 32px rgba(0,0,0,0.3); position: relative; overflow: hidden;">
              <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #3b82f6, #06b6d4, #3b82f6);"></div>
              <div style="padding-top: 0.5em;">
                ${paragraphContent}
              </div>
              <div style="position: absolute; bottom: -10px; right: -10px; width: 40px; height: 40px; background: #3b82f6; border-radius: 50%; opacity: 0.1;"></div>
            </div>
          `;
          setArticle(prev => prev ? { ...prev, fullContent } : null);
        }
      }
    } catch (error) {
      console.error('Error fetching full article content:', error);
      // Gracefully handle CORS errors - don't show error to user, just log it
      // The component will fall back to showing the basic article content
    } finally {
      setFullContentLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-900 to-blue-900 relative overflow-hidden min-h-screen">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading article...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !article) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-900 to-blue-900 relative overflow-hidden min-h-screen">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error || 'Article not found'}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-blue-900 relative overflow-hidden min-h-screen">
      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        <button
          onClick={() => navigate('/blog')}
          className="mb-8 bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-all duration-300 font-semibold"
        >
          ← Back to Blog Updates
        </button>

        <article className="bg-white/10 backdrop-blur-md rounded-3xl p-8">
          {/* Article Meta */}
          <div className="text-sm text-gray-300 mb-6 flex flex-wrap items-center gap-4">
            <span>{new Date(article.publishedAt || article.date).toLocaleDateString()}</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold mb-8 text-blue-400">{article.title}</h1>

          {/* Article Image */}
          <div className="mb-8 relative overflow-hidden rounded-2xl shadow-lg bg-gray-800/50 flex items-center justify-center">
            <img
              src={aiImages[(parseInt(id || '0') + new Date().getHours()) % aiImages.length]}
              alt={article.title}
              className="max-w-full max-h-64 md:max-h-80 object-contain rounded-2xl"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                e.currentTarget.src = aiImages[0]; // Fallback to first image if current fails to load
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Article Summary */}
          {article.description && (
            <div className="text-white leading-relaxed text-lg mb-8 bg-white/5 p-6 rounded-xl border-l-4 border-blue-400">
              <h4 className="text-blue-400 font-semibold mb-4">Summary</h4>
              {article.description}
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg prose-slate max-w-none prose-headings:text-white prose-p:text-gray-200 prose-p:leading-relaxed prose-a:text-blue-400 prose-a:hover:text-blue-300 prose-strong:text-white prose-ul:space-y-2 prose-ol:space-y-2 prose-li:text-gray-200 prose-blockquote:border-l-4 prose-blockquote:border-blue-400 prose-blockquote:bg-blue-900/30 prose-blockquote:p-6 prose-blockquote:rounded-r-lg">
            {fullContentLoading && (
              <div className="text-center py-8">
                <div className="inline-flex items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mr-3"></div>
                  <p className="text-gray-300">Loading full article content...</p>
                </div>
              </div>
            )}
            {article.fullContent ? (
              <div className="space-y-6">
                <div dangerouslySetInnerHTML={{ __html: article.fullContent }} />
              </div>
            ) : article.content && article.content.length > 0 ? (
              <div className="space-y-6">
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              </div>
            ) : (
              <p className="text-gray-200 leading-relaxed text-xl">{article.description}</p>
            )}
          </div>


        </article>
      </div>
    </section>
  );
};

export default BlogDetail;
