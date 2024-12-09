const { Avalanche } = require('@avalabs/avalanchejs');

let avalanche;

const setupAvalancheNetwork = () => {
  try {
    avalanche = new Avalanche(
      process.env.AVALANCHE_API_URL,
      parseInt(process.env.AVALANCHE_NETWORK_ID),
      process.env.AVALANCHE_CHAIN_ID
    );
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