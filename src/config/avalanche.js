const { Avalanche } = require('@avalabs/avalanchejs');

let avalanche;

const setupAvalancheNetwork = () => {
  try {
    const protocol = 'https';
    const ip = 'api.avax-test.network';
    const port = 443;
    const networkID = parseInt(process.env.AVALANCHE_NETWORK_ID || '5');
    const chainID = process.env.AVALANCHE_CHAIN_ID || '43113';

    avalanche = new Avalanche(ip, port, protocol, networkID, chainID);
    
    console.log('Avalanche network connection established');
    return avalanche;
  } catch (error) {
    console.error('Failed to connect to Avalanche network:', error);
    process.exit(1);
  }
};

const getAvalancheInstance = () => {
  if (!avalanche) {
    throw new Error('Avalanche network not initialized');
  }
  return avalanche;
};

module.exports = {
  setupAvalancheNetwork,
  getAvalancheInstance
};