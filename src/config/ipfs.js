const { create } = require('ipfs-http-client');

// Configure IPFS client
const setupIPFSClient = () => {
  try {
    // Using Infura's IPFS gateway
    const projectId = process.env.INFURA_IPFS_PROJECT_ID;
    const projectSecret = process.env.INFURA_IPFS_PROJECT_SECRET;
    
    if (!projectId || !projectSecret) {
      throw new Error('IPFS credentials not configured');
    }

    const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

    const ipfs = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
        authorization: auth
      }
    });

    return ipfs;
  } catch (error) {
    console.error('IPFS initialization error:', error);
    throw error;
  }
};

// Utility function to upload file to IPFS
const uploadToIPFS = async (file) => {
  try {
    const ipfs = setupIPFSClient();
    
    // Add the file to IPFS
    const result = await ipfs.add(file);
    
    return {
      cid: result.cid.toString(),
      size: result.size,
      // Construct gateway URL for easy access
      url: `https://ipfs.io/ipfs/${result.cid.toString()}`
    };
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw error;
  }
};

// Utility function to upload JSON metadata to IPFS
const uploadJSONToIPFS = async (jsonData) => {
  try {
    const ipfs = setupIPFSClient();
    
    // Convert JSON to Buffer
    const buffer = Buffer.from(JSON.stringify(jsonData));
    
    // Add the JSON to IPFS
    const result = await ipfs.add(buffer);
    
    return {
      cid: result.cid.toString(),
      size: result.size,
      url: `https://ipfs.io/ipfs/${result.cid.toString()}`
    };
  } catch (error) {
    console.error('IPFS JSON upload error:', error);
    throw error;
  }
};

// Utility function to retrieve content from IPFS
const getFromIPFS = async (cid) => {
  try {
    const ipfs = setupIPFSClient();
    let content = [];
    
    // Get the content from IPFS
    for await (const chunk of ipfs.cat(cid)) {
      content.push(chunk);
    }
    
    // Combine chunks and convert to buffer
    const buffer = Buffer.concat(content);
    
    return buffer;
  } catch (error) {
    console.error('IPFS retrieval error:', error);
    throw error;
  }
};

module.exports = {
  setupIPFSClient,
  uploadToIPFS,
  uploadJSONToIPFS,
  getFromIPFS
};