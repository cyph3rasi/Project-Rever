const { setupStorageClient, uploadJSONToIPFS, getFromIPFS, unpinFromIPFS } = require('../config/ipfs');

describe('IPFS Integration', () => {
  let testCID;

  // Test data
  const testData = {
    title: 'Test Post',
    content: 'This is a test post',
    timestamp: Date.now()
  };

  beforeAll(() => {
    // Ensure environment variables are set
    if (!process.env.PINATA_API_KEY || !process.env.PINATA_API_SECRET) {
      throw new Error('Pinata API credentials not configured');
    }
  });

  test('should initialize Pinata client', () => {
    const client = setupStorageClient();
    expect(client).toBeDefined();
  });

  test('should upload JSON to IPFS', async () => {
    const result = await uploadJSONToIPFS(testData);
    expect(result).toHaveProperty('cid');
    expect(result).toHaveProperty('url');
    testCID = result.cid;
  });

  test('should retrieve content from IPFS', async () => {
    const result = await getFromIPFS(testCID);
    expect(result).toBeDefined();
  });

  test('should unpin content from IPFS', async () => {
    const result = await unpinFromIPFS(testCID);
    expect(result).toBe(true);
  });
});
