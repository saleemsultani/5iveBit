import axios from 'axios';

// Scan URL
export const scanURL = async (url) => {
  const encodedParams = new URLSearchParams();
  encodedParams.set('url', url);

  const options = {
    method: 'POST',
    url: 'https://www.virustotal.com/api/v3/urls',
    headers: {
      accept: 'application/json',
      'x-apikey': import.meta.env.VITE_VIRUSTOTAL_API_KEY,
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: encodedParams
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error('Error scanning URL:', error);
    throw error;
  }
};

// Get URL scan results
export const getAnalysisResults = async (analysisId) => {
  const options = {
    method: 'GET',
    url: `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
    headers: {
      accept: 'application/json',
      'x-apikey': import.meta.env.VITE_VIRUSTOTAL_API_KEY
    }
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error('Error getting analysis results:', error);
    throw error;
  }
};
