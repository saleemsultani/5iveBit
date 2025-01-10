import axios from 'axios';

const BASE_URL = 'https://cve.circl.lu/api';

// Fetch all vendors
export const fetchAllVendors = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/browse`);
    return response.data;
  } catch (error) {
    console.error('Error fetching vendors:', error);
    throw error;
  }
};

// Fetch products by vendor
export const fetchProductsByVendor = async (vendor) => {
  try {
    const response = await axios.get(`${BASE_URL}/browse/${vendor}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching products for vendor ${vendor}:`, error);
    throw error;
  }
};

// Fetch CVEs for a specific product
export const fetchCVEsForProduct = async (vendor, product) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/${vendor}/${product}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching CVEs for ${vendor}/${product}:`, error);
    throw error;
  }
};

// Fetch CVE details by CVE-ID
export const fetchCVEByID = async (cveId) => {
  try {
    const response = await axios.get(`${BASE_URL}/cve/${cveId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching CVE ${cveId}:`, error);
    throw error;
  }
};

// Fetch last updated CVEs
export const fetchLastUpdatedCVEs = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/last`);
    return response.data;
  } catch (error) {
    console.error('Error fetching last updated CVEs:', error);
    throw error;
  }
};

// Fetch database info
export const fetchDatabaseInfo = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/dbInfo`);
    return response.data;
  } catch (error) {
    console.error('Error fetching database info:', error);
    throw error;
  }
};
