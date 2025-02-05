import { fetchCVEByID } from './cveSearchAPI';
import { fetchCVEsByVendorAndProduct } from './openCVEAPI';
import { WrapperPrompt } from '../contexts/prompts';

export let shouldRenderSavePDF = false;

export const setShouldRenderSavePDF = (value) => {
  shouldRenderSavePDF = value;
};

export const handleCVEQuery = async (
  promptInput,
  updatedMessages,
  setcurrentChat,
  updateCurrentChat
) => {
  console.log('handleCVEQuery called with promptInput:', promptInput);

  // Check if the promptInput contains relevant terms
  const relevantTerms = /vulnerability|vulnerabilities|CVE|vuln/i;
  if (relevantTerms.test(promptInput)) {
    console.log('Relevant terms found in promptInput.');

    // Check if the promptInput contains a CVE-ID related query
    const cveMatch = promptInput.match(/CVE-\d{4}-\d{4,7}/i);
    let cveInfo = null;
    if (cveMatch) {
      console.log('CVE-ID related query found:', cveMatch[0]);
      const cveId = cveMatch[0];
      try {
        const cveData = await fetchCVEByID(cveId);

        // Extract only the important information from the response
        cveInfo = cveData
          ? {
              cveId: cveData.cveMetadata.cveId,
              description: cveData.containers.cna.descriptions[0]?.value,
              affectedProduct: cveData.containers.cna.affected[0]?.product,
              affectedVendor: cveData.containers.cna.affected[0]?.vendor,
              datePublished: cveData.cveMetadata.datePublished,
              references: cveData.containers.cna.references.map((ref) => ({
                name: ref.name,
                url: ref.url
              }))
            }
          : null;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log('CVE data not found (404).');
        } else {
          throw error;
        }
      }
    }

    const vendorProductPattern = /(latest|newest) (vulnerabilities|CVEs) (for|in) (\w+) (\w+)/i;
    const vendorProductMatch = promptInput.match(vendorProductPattern);
    let cveProductInfo = null;

    if (vendorProductMatch) {
      // Indices 1, 2, and 3 are used for groups (latest|newest) (vulnerabilities|CVEs) (for|in)
      // Indices 4 and 5 are used for groups (\w+) (\w+) which are the vendor and product respectively
      const vendor = vendorProductMatch[4];
      const product = vendorProductMatch[5];
      console.log(`Fetching latest vulnerabilities for vendor: ${vendor}, product: ${product}`);

      try {
        // Fetch the CVE data using the API
        const cveProductData = await fetchCVEsByVendorAndProduct(vendor, product);

        // Process the data if available
        cveProductInfo = cveProductData.results
          ? cveProductData.results.map((cve) => ({
              cve_id: cve.cve_id,
              description: cve.description,
              updated_at: cve.updated_at
            }))
          : 'No CVE data found for this vendor and product.';
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log('CVE product data not found (404).');
        } else {
          throw error;
        }
      }
    }

    // Prepare the CVE-ID content to be displayed
    const cveResponse = cveInfo
      ? `CVE ID: ${cveInfo.cveId}\n` +
        `Description: ${cveInfo.description}\n` +
        `Affected Product: ${cveInfo.affectedProduct}\n` +
        `Affected Vendor: ${cveInfo.affectedVendor}\n` +
        `Date Published: ${cveInfo.datePublished}\n` +
        `References:\n` +
        cveInfo.references.map((ref) => `- ${ref.name}: ${ref.url}`).join('\n')
      : '';

    console.log(cveResponse);

    // Prepare the CVE Product content to be displayed
    const cveProductResponse =
      cveProductInfo && Array.isArray(cveProductInfo)
        ? cveProductInfo
            .map((cve) => {
              return (
                `CVE ID: ${cve.cve_id}\n` +
                `Description: ${cve.description}\n` +
                `Date Published: ${cve.updated_at}\n`
              );
            })
            .join('\n')
        : '';

    console.log(cveProductResponse);

    // Set default values if responses are empty
    const finalCveResponse = cveResponse || '';
    const finalCveProductResponse = cveProductResponse || '';

    // Combine the promptInput, CVE details, and WrapperPrompt
    const combinedMessage =
      `${WrapperPrompt}\n\n${promptInput}\n\n${finalCveResponse}\n\n${finalCveProductResponse}`.trim();

    console.log('Combined message:', combinedMessage);

    // Send request to the local LLM server
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: '5iveBit-ca-4',
        messages: [...updatedMessages, { role: 'user', content: combinedMessage }],
        stream: false
      })
    });

    console.log('Response received:', response);

    // Debug logging for API response
    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);

    const text = await response.text();
    console.log('Raw response text:', text);

    let data;
    try {
      data = JSON.parse(text);
      console.log('Parsed response data:', data);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Invalid JSON response');
    }

    if (!data.message || !data.message.content) {
      console.error('No message content in data:', data);
      throw new Error('No message content in data');
    }

    // Update chat with the AI's response
    // //////////////////
    setcurrentChat((current) => {
      const newChat = {
        ...current,
        messages: [...updatedMessages, { role: 'assistant', content: data.message.content }]
      };

      // save the changes done in currentChat in the DB
      // console.log('type of data.messages.content ', data.messages.content);
      updateCurrentChat({ chatId: newChat._id, messages: newChat.messages }); // Using the new state
      return newChat;
    });

    // /////////////////

    // Set shouldRenderSavePDF to true if certain conditions are met
    setShouldRenderSavePDF(true);

    return data.message.content;
  } else {
    console.log('No relevant terms found in promptInput.');
    return null;
  }
};
