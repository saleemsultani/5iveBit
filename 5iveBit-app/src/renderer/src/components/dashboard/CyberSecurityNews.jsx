import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchCyberNews } from './CyberNewsAPI';
import styles from './CyberSecurityNews.module.css';

function CyberSecurityNews() {
  // State for managing news data, loading, and errors
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch news on component mount
  useEffect(() => {
    let mounted = true;

    const loadNews = async () => {
      try {
        setLoading(true);
        const articles = await fetchCyberNews();

        if (mounted) {
          setNews(articles);
          setError(null);
        }
      } catch (err) {
        console.error('Error in loadNews:', err);
        if (mounted) {
          setError('Failed to load cybersecurity news');
          setNews([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadNews();
    // Cleanup to prevent memory leaks
    return () => {
      mounted = false;
    };
  }, []);

  // Handle opening news articles in browser
  const handleNewsClick = (url) => {
    if (url) {
      try {
        window.open(url, '_blank', 'noopener,noreferrer');
      } catch (error) {
        console.error('Error opening URL:', error);
      }
    }
  };

  // Loading state view
  if (loading) {
    return (
      <Box className={styles.cyberSecurityNewsWrapper}>
        <Box className={styles.loadingSpinner}>
          <CircularProgress color="secondary" />
        </Box>
      </Box>
    );
  }

  return (
    <Box className={styles.cyberSecurityNewsWrapper}>
      {/* Header with back navigation */}
      <Box className={styles.headerSection}>
        <Box className={styles.navigation}>
          <IconButton
            onClick={() => {
              const urlParams = new URLSearchParams(window.location.search);
              const fromNavbar = urlParams.get('from') === 'navbar';
              window.location.href = fromNavbar ? '/chat' : '/dashboard';
            }}
            className={styles.backButton}
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>

        <Typography variant="h3" className={styles.header}>
          Cybersecurity News
        </Typography>
      </Box>

      {/* Main content area */}
      <Box className={styles.mainContent}>
        {/* Introduction section */}
        <Box className={styles.alertBox}>
          <Typography variant="h5" className={styles.alertTitle}>
            Empower Your Cybersecurity Journey with the Latest Intelligence
          </Typography>
          <Typography className={styles.alertText}>
            Keep up with the latest in emerging threats and data breaches-all from our real-time
            feed of the cybersecurity incidents. We summarize the critical information you need to
            so you&apos;re always prepared and updated, which will help protect your digital assets.
            assets. Take control of your security knowledge and stay one step ahead with
            instantaneous access to security development.
          </Typography>
        </Box>

        {/* News cards container */}
        <Box className={styles.contentContainer}>
          {error ? (
            // Error state
            <Typography className={styles.errorText}>{error}</Typography>
          ) : news.length > 0 ? (
            // News cards
            news.map((article, index) => (
              <Box key={index} className={styles.newsCard}>
                <Typography variant="h6" className={styles.newsTitle}>
                  {article.title}
                </Typography>
                <Typography className={styles.newsText}>{article.description}</Typography>
                <Box className={styles.newsFooter}>
                  <Typography className={styles.newsSource}>
                    Source: {article.source.name}
                  </Typography>
                  <Typography
                    className={styles.newsLink}
                    onClick={() => handleNewsClick(article.url)}
                  >
                    Click to read more →
                  </Typography>
                </Box>
              </Box>
            ))
          ) : (
            // Empty state
            <Typography className={styles.newsText}>No news available at the moment.</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default CyberSecurityNews;
