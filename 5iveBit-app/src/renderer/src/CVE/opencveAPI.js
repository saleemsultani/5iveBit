import axios from 'axios';

const BASE_URL = 'https://app.opencve.io/api';

const auth = {
  username: import.meta.env.VITE_OPENCVE_USERNAME,
  password: import.meta.env.VITE_OPENCVE_PASSWORD
};

export const fetchCVEsByVendorAndProduct = async (vendor, product) => {
  try {
    console.log(auth);
    const response = await axios.get(`${BASE_URL}/cve`, {
      params: { vendor, product },
      auth
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      //Server responded with an error status code
      console.error('Response error:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error.request) {
      //Request was made but no response received
      console.error('Request error:', error.request);
    } else {
      //Other errors
      console.error('Error:', error.message);
    }
    throw error;
  }
};
