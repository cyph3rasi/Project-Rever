const { Web3Storage } = require('web3.storage');

// Configure Web3.Storage client
const setupStorageClient = () => {
  try {
    const token = process.env.WEB3_STORAGE_TOKEN;
    
    if (!token) {
      throw new Error('Web3.Storage token not configured');
    }

    return new Web3Storage({ token });
  } catch (error) {
    console.error('Web3.Storage initialization error:', error);
    throw error;
  }
};

// Utility function to upload file to IPFS via Web3.Storage
const uploadToIPFS = async (file) => {
  try {
    const client = setupStorageClient();
    
    // Upload the file
    const cid = await client.put([file]);
    
    return {
      cid: cid,
      url: `https://${cid}.ipfs.dweb.link/${file.name}`
    };
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw error;
  }
};

// Utility function to upload JSON metadata to IPFS
const uploadJSONToIPFS = async (jsonData) => {
  try {
    const client = setupStorageClient();
    
    // Create a file from the JSON data
    const blob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
    const files = [
      new File([blob], 'metadata.json')
    ];
    
    // Upload the file
    const cid = await client.put(files);
    
    return {
      cid: cid,
      url: `https://${cid}.ipfs.dweb.link/metadata.json`
    };
  } catch (error) {
    console.error('IPFS JSON upload error:', error);
    throw error;
  }
};

// Utility function to retrieve content from IPFS
const getFromIPFS = async (cid) => {
  try {
    const client = setupStorageClient();
    
    // Get the data from IPFS
    const res = await client.get(cid);
    if (!res.ok) {
      throw new Error(`Failed to get ${cid}`);
    }
    
    // Get all the files in the response
    const files = await res.files();
    return files;
  } catch (error) {
    console.error('IPFS retrieval error:', error);
    throw error;
  }
};

module.exports = {
  setupStorageClient,
  uploadToIPFS,
  uploadJSONToIPFS,
  getFromIPFS
};