import axios from 'axios';

// API endpoint for news
const NEWS_API_URL = 'https://newsapi.org/v2/everything';
// API key from environment variables for security
const API_KEY = import.meta.env.VITE_NEWS_API_KEY;

// Function to fetch cybersecurity related news
export const fetchCyberNews = async () => {
  try {
    // Make API request with required headers
    const response = await axios.get(NEWS_API_URL, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-Requested-With': 'XMLHttpRequest',
        mode: 'cors'
      },
      // Parameters for filtering cybersecurity news
      params: {
        // Search query targeting cybersecurity topics
        q: '(cybersecurity OR "cyber attack" OR "data breach" OR "cyber security" OR "ransomware" OR "cyber threat")',
        sortBy: 'publishedAt', // Get newest articles first
        language: 'en',
        pageSize: 20,
        apiKey: API_KEY
      }
    });

    // Sort articles by date (newest to oldest)
    const sortedArticles = response.data.articles.sort(
      (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
    );

    return sortedArticles;
  } catch (error) {
    // Log error and return empty array if request fails
    console.error('Error fetching cybersecurity news:', error);
    return [];
  }
};
