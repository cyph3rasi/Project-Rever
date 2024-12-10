const { uploadToIPFS, uploadJSONToIPFS, getFromIPFS, unpinFromIPFS } = require('../config/ipfs');

// Handle file uploads to IPFS
const uploadFile = async (req, res) => {
  try {
    console.log('Upload request received:', {
      headers: req.headers,
      file: req.file,
      body: req.body
    });

    if (!req.file) {
      console.error('No file in request');
      return res.status(400).json({ error: 'No file provided' });
    }

    console.log('Processing file:', req.file.originalname);
    const result = await uploadToIPFS(req.file);
    console.log('IPFS upload result:', result);

    res.json({
      success: true,
      cid: result.cid,
      url: result.url
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload file to IPFS',
      details: error.message
    });
  }
};

// Handle JSON data uploads to IPFS
const uploadJSON = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: 'No JSON data provided' });
    }

    const result = await uploadJSONToIPFS(req.body);
    res.json({
      success: true,
      cid: result.cid,
      url: result.url
    });
  } catch (error) {
    console.error('JSON upload error:', error);
    res.status(500).json({ error: 'Failed to upload JSON to IPFS' });
  }
};

// Get content metadata from IPFS
const getContent = async (req, res) => {
  try {
    const { cid } = req.params;
    if (!cid) {
      return res.status(400).json({ error: 'No CID provided' });
    }

    const result = await getFromIPFS(cid);
    res.json({
      success: true,
      metadata: result
    });
  } catch (error) {
    console.error('Content retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve content from IPFS' });
  }
};

// Unpin content from IPFS
const unpinContent = async (req, res) => {
  try {
    const { cid } = req.params;
    if (!cid) {
      return res.status(400).json({ error: 'No CID provided' });
    }

    await unpinFromIPFS(cid);
    res.json({
      success: true,
      message: 'Content unpinned successfully'
    });
  } catch (error) {
    console.error('Unpin error:', error);
    res.status(500).json({ error: 'Failed to unpin content from IPFS' });
  }
};

module.exports = {
  uploadFile,
  uploadJSON,
  getContent,
  unpinContent
};
