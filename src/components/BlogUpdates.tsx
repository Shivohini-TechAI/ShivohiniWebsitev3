import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Article {
  date: string;
  title: string;
  description: string;
  content: string;
  url?: string;
  source?: {
    name: string;
  };
  urlToImage?: string;
  author?: string;
  publishedAt?: string;
}

const BlogUpdates = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [clickedArticles, setClickedArticles] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState<number>(0);
  const navigate = useNavigate();
  const articlesPerPage = 3;

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

  // Function to strip HTML tags, images, and unwanted content from text
  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    // Remove images
    const images = tmp.querySelectorAll("img");
    images.forEach(img => img.remove());
    let text = tmp.textContent || tmp.innerText || "";

    // Remove unwanted content
    const unwantedPatterns = [
      /Follow topics and authors from this story to see more like this in your personalized homepage feed and to receive email updates\./gi,
      /Stevie Bonifield/gi,
      /Gaming/gi,
      /Labor/gi,
      /News/gi,
      /Tech/gi,
      /More in this stream/gi,
      /See all/gi,
      /Am I the only person that didn\'t watch the GTA VI trailer\?/gi,
      /Dominic PrestonMay \d+/gi,
      /Rockstar says new GTA VI trailer was 'equal parts gameplay and cutscenes'/gi,
      /Andrew WebsterMay \d+/gi,
      /Grand Theft Auto VI's second trailer sets up its Bonnie and Clyde story/gi,
      /Most Popular/gi,
      /Making KPop Demon Hunters sound magical meant finding the right harmonies/gi,
      /LG's brilliant B5 OLED TV is already down to just \$530 for Black Friday/gi,
      /The Playdate is a great indie puzzle machine/gi,
      /Where is the Trump phone\?/gi,
      /Google's Pixel Watch 3 and Anker's two-headed USB-C cable are our favorite deals this week/gi,
      /The Verge Daily/gi,
      /A free daily digest of the news that matters most\./gi,
      /Email \(required\)/gi,
      /Enter your email/gi,
      /Sign Up/gi,
      /By submitting your email, you agree to our Terms and Privacy Notice\. This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply\./gi,
      /Text settings/gi,
      /Story text/gi,
      /Size/gi,
      /Standard/gi,
      /Links/gi,
      /Minimize to nav/gi,
      /CommentLoaderSave StorySave this story/gi
    ];

    unwantedPatterns.forEach(pattern => {
      text = text.replace(pattern, '');
    });

    // Clean up extra whitespace and empty lines
    text = text.replace(/\n\s*\n/g, '\n').trim();

    return text;
  };

  // Function to generate blog updates using OpenAI API
  const fetchNews = async () => {
    console.log('fetchNews function called');
    const startTime = Date.now();
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = `news_${today}`;
    console.log('Cache key:', cacheKey);

    // Force fresh data fetching by clearing cache
    localStorage.removeItem(cacheKey);
    console.log('Cache cleared, fetching fresh data');

    try {
      console.log('Generating blog updates using OpenAI...');
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
            content: `Generate 6 unique news articles about AI, artificial intelligence, technology, innovation, or computer science. Each article should include:
- title: A catchy news headline
- description: A brief news summary (2-3 sentences)
- content: A detailed news article body with at least 6-8 paragraphs (600-800 words) covering facts, developments, and implications
- date: Today's date in YYYY-MM-DD format
- publishedAt: Current timestamp in ISO format
- source: { name: "AI Generated" }
- author: "AI Assistant"

Return the response as a valid JSON array of objects with these exact keys. Ensure each article is unique, informative, and structured like professional news reporting. Avoid repetition of content across articles.`
            }
          ],
          max_tokens: 3000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('OpenAI Response:', data);

      if (data.choices && data.choices[0] && data.choices[0].message) {
        const generatedContent = data.choices[0].message.content;
        console.log('Generated content:', generatedContent);

        // Parse the JSON response, handling potential markdown formatting
        let articles: Article[];
        try {
          // Remove markdown code blocks if present
          let cleanedContent = generatedContent.trim();
          if (cleanedContent.startsWith('```json')) {
            cleanedContent = cleanedContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
          } else if (cleanedContent.startsWith('```')) {
            cleanedContent = cleanedContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
          }
          articles = JSON.parse(cleanedContent);
          console.log('Parsed articles:', articles);
        } catch (parseError) {
          console.error('Error parsing OpenAI response:', parseError);
          console.error('Raw response:', generatedContent);
          throw new Error('Failed to parse generated content');
        }

        // Ensure we have exactly 6 articles
        if (!Array.isArray(articles) || articles.length !== 6) {
          throw new Error('Invalid number of articles generated');
        }

        // Validate and map articles to ensure they match the Article interface
        const mappedArticles: Article[] = articles.map((article: any, index: number) => {
          const today = new Date().toISOString().split('T')[0];
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
          const dayBeforeYesterday = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];
          let date, publishedAt;
          if (index < 2) {
            date = today;
            publishedAt = new Date().toISOString();
          } else if (index < 4) {
            date = yesterday;
            publishedAt = new Date(Date.now() - 86400000).toISOString();
          } else {
            date = dayBeforeYesterday;
            publishedAt = new Date(Date.now() - 2 * 86400000).toISOString();
          }
          return {
            date,
            title: article.title || `AI Blog Post ${index + 1}`,
            description: article.description || 'Generated description',
            content: article.content || 'Generated content',
            url: article.url || null,
            source: article.source || { name: 'AI Generated' },
            urlToImage: `https://source.unsplash.com/400x200/?computer,laptop,technology,digital,software&sig=${index}`,
            author: article.author || 'AI Assistant',
            publishedAt,
          };
        });

        console.log('Mapped articles:', mappedArticles);
        setArticles(mappedArticles);
        // Cache the data
        localStorage.setItem(cacheKey, JSON.stringify(mappedArticles));
      } else {
        throw new Error('Invalid response from OpenAI API');
      }
    } catch (err) {
      console.error('Error generating blog updates:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate blog updates');

      // Try to load cached data from previous days if available
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const yesterdayCacheKey = `news_${yesterday}`;
      const yesterdayData = localStorage.getItem(yesterdayCacheKey);
      if (yesterdayData) {
        setArticles(JSON.parse(yesterdayData));
        setError('Showing yesterday\'s updates due to API error');
      }
    } finally {
      const elapsedTime = Date.now() - startTime;
      const minLoadingTime = 2000; // 2 seconds minimum loading time
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      setTimeout(() => {
        setLoading(false);
      }, remainingTime);
    }
  };

  useEffect(() => {
    console.log('BlogUpdates component mounted, loading articles');
    // Reset clicked articles when component mounts (when navigating back)
    setClickedArticles(new Set());

    const today = new Date().toISOString().split('T')[0];
    const cacheKey = `news_${today}`;

    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      const articles = JSON.parse(cachedData);
      setArticles(articles);
      setLoading(false);
      // Set up hourly update interval (3600000 ms = 1 hour)
      const updateInterval = setInterval(() => {
        console.log('Hourly update triggered');
        fetchNews();
      }, 3600000); // Update every hour

      return () => clearInterval(updateInterval);
    } else {
      // No today's cache, fetch new data
      fetchNews();
      // Set up hourly update interval after initial fetch
      const updateInterval = setInterval(() => {
        console.log('Hourly update triggered');
        fetchNews();
      }, 3600000); // Update every hour

      return () => clearInterval(updateInterval);
    }
  }, []);

  if (loading) {
    return (
      <section id="blog" className="py-20 bg-gradient-to-br from-gray-900 to-blue-900 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Latest <span className="text-blue-400">Blog Updates</span>
            </h2>
          </div>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            <span className="ml-4 text-gray-300">Loading latest news...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="blog" className="py-20 bg-gradient-to-br from-gray-900 to-blue-900 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Latest <span className="text-blue-400">Blog Updates</span>
            </h2>
          </div>
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">Failed to load news: {error}</p>
            <p className="text-gray-300">Please check your internet connection and try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  console.log('BlogUpdates rendering with articles:', articles.length);
  console.log('Articles data:', articles);
  return (
    <section id="blog" className="py-20 bg-gradient-to-br from-gray-900 to-blue-900 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Latest <span className="text-blue-400">Blog Updates</span>
          </h2>
        </div>
        {articles.length === 0 && !loading && !error && (
          <div className="text-center py-8">
            <p className="text-gray-300">No articles available at the moment.</p>
          </div>
        )}
        {/* Sliding Container with Navigation */}
        <div className="relative flex items-center">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 text-white p-3 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Sliding Container */}
          <div className="relative overflow-hidden flex-1 mx-12">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentPage * 100}%)` }}
            >
              {Array.from({ length: Math.ceil(articles.length / articlesPerPage) }, (_, pageIndex) => (
                <div key={pageIndex} className="flex-shrink-0 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
                  {articles.slice(pageIndex * articlesPerPage, (pageIndex + 1) * articlesPerPage).map((article, index) => {
                    const globalIndex = pageIndex * articlesPerPage + index;
                    const isClicked = clickedArticles.has(globalIndex);
                    return (
                      <div
                        key={globalIndex}
                        className="group relative bg-white/10 backdrop-blur-md rounded-3xl p-6 hover:bg-white/20 transition-all duration-500 cursor-pointer overflow-hidden"
                        style={{
                          animationDelay: `${index * 150}ms`
                        }}
                      >


                        {/* Content */}
                        <div className="relative z-10">
                          <p className="text-sm text-gray-300 mb-4">{new Date(article.publishedAt || article.date).toLocaleDateString()}</p>
                          <h3
                            className={`text-xl font-bold mb-4 cursor-pointer transition-colors ${isClicked ? 'text-blue-400' : 'text-white group-hover:text-blue-400'}`}
                            onClick={() => {
                              setClickedArticles(prev => new Set(prev).add(globalIndex));
                              navigate(`/blog/${globalIndex}`);
                            }}
                          >
                            {article.title}
                          </h3>
                          <p className="text-gray-300 leading-relaxed mb-6 group-hover:text-gray-200 transition-colors duration-300">
                            {(stripHtml(article.description || "")).slice(0, 60) + "..."}
                          </p>

                          {/* Learn More Button */}
                          <button
                            onClick={() => navigate(`/blog/${globalIndex}`)}
                            className="flex items-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-300 font-semibold hover:from-blue-300 hover:to-blue-200 transform group-hover:translate-x-2 transition-all duration-300"
                          >
                            Read More
                            <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={() => setCurrentPage(prev => Math.min(Math.ceil(articles.length / articlesPerPage) - 1, prev + 1))}
            disabled={currentPage === Math.ceil(articles.length / articlesPerPage) - 1}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md rounded-full p-3 hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: Math.ceil(articles.length / articlesPerPage) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentPage === index ? "bg-blue-400 scale-125" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogUpdates;
