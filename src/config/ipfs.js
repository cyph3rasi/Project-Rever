const pinataSDK = require('@pinata/sdk');
const { Readable } = require('stream');
const fs = require('fs');

// Configure Pinata client
const setupStorageClient = () => {
  try {
    const apiKey = process.env.PINATA_API_KEY;
    const apiSecret = process.env.PINATA_API_SECRET;
    
    if (!apiKey || !apiSecret) {
      throw new Error('Pinata API credentials not configured');
    }

    return new pinataSDK(apiKey, apiSecret);
  } catch (error) {
    console.error('Pinata initialization error:', error);
    throw error;
  }
};

// Utility function to upload file to IPFS via Pinata
const uploadToIPFS = async (file) => {
  try {
    console.log('Starting file upload to IPFS...');
    console.log('File details:', {
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });

    const client = setupStorageClient();
    
    const readableStreamForFile = new Readable();
    readableStreamForFile._read = () => {}; // Required for readable streams
    readableStreamForFile.push(file.buffer);
    readableStreamForFile.push(null);

    const options = {
      pinataMetadata: {
        name: file.originalname,
      }
    };
    
    console.log('Uploading to Pinata...');
    // Upload the file
    const result = await client.pinFileToIPFS(readableStreamForFile, options);
    console.log('Pinata upload result:', result);
    
    return {
      success: true,
      cid: result.IpfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
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
    
    const options = {
      pinataMetadata: {
        name: 'metadata.json',
      }
    };
    
    // Upload the JSON data
    const result = await client.pinJSONToIPFS(jsonData, options);
    
    return {
      success: true,
      cid: result.IpfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
    };
  } catch (error) {
    console.error('IPFS JSON upload error:', error);
    throw error;
  }
};

// Utility function to retrieve content metadata from IPFS
const getFromIPFS = async (cid) => {
  try {
    const client = setupStorageClient();
    
    // Get the pin data
    const result = await client.pinList({
      hashContains: cid
    });

    if (result.count === 0) {
      throw new Error(`No content found for CID: ${cid}`);
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('IPFS retrieval error:', error);
    throw error;
  }
};

// Utility function to unpin content from IPFS
const unpinFromIPFS = async (cid) => {
  try {
    const client = setupStorageClient();
    await client.unpin(cid);
    return true;
  } catch (error) {
    console.error('IPFS unpin error:', error);
    throw error;
  }
};

module.exports = {
  setupStorageClient,
  uploadToIPFS,
  uploadJSONToIPFS,
  getFromIPFS,
  unpinFromIPFS
};