// API Configuration
const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const ETHERSCAN_API = 'https://api.etherscan.io/api';
const ETHERSCAN_API_KEY = 'YourApiKeyHere'; // Get free key at etherscan.io
const BLOCKCHAIN_INFO_API = 'https://blockchain.info';
const BLOCKCYPHER_API = 'https://api.blockcypher.com/v1';

// Cache for prices (5 minutes)
let priceCache = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch wallet balance based on blockchain
 */
export async function fetchWalletBalance(chain, address) {
  try {
    switch (chain) {
      case 'ethereum':
        return await getEthereumBalance(address);
      case 'bitcoin':
        return await getBitcoinBalance(address);
      case 'solana':
        return await getSolanaBalance(address);
      default:
        throw new Error(`Unsupported chain: ${chain}`);
    }
  } catch (error) {
    console.error(`Error fetching balance for ${chain}:`, error);
    return 0;
  }
}

/**
 * Fetch cryptocurrency price in USD
 */
export async function fetchCryptoPrice(chain) {
  const cacheKey = `price_${chain}`;
  const cached = priceCache[cacheKey];

  // Return cached price if still valid
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.price;
  }

  try {
    const coinId = getCoinGeckoId(chain);
    const url = `${COINGECKO_API}/simple/price?ids=${coinId}&vs_currencies=usd`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    const price = data[coinId]?.usd || 0;

    // Cache the price
    priceCache[cacheKey] = {
      price,
      timestamp: Date.now()
    };

    return price;
  } catch (error) {
    console.error(`Error fetching price for ${chain}:`, error);
    return 0;
  }
}

/**
 * Get Ethereum balance
 */
async function getEthereumBalance(address) {
  try {
    // Using Etherscan API
    const url = `${ETHERSCAN_API}?module=account&action=balance&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== '1') {
      throw new Error(data.message || 'Etherscan API error');
    }

    // Convert from Wei to ETH
    const balanceWei = data.result;
    const balanceEth = parseFloat(balanceWei) / 1e18;

    return balanceEth;
  } catch (error) {
    console.error('Error fetching Ethereum balance:', error);
    
    // Fallback: Try using public RPC (less reliable but no API key needed)
    try {
      const rpcUrl = 'https://eth.llamarpc.com';
      const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getBalance',
          params: [address, 'latest'],
          id: 1
        })
      });

      const data = await response.json();
      const balanceWei = parseInt(data.result, 16);
      return balanceWei / 1e18;
    } catch (fallbackError) {
      console.error('Fallback RPC also failed:', fallbackError);
      return 0;
    }
  }
}

/**
 * Get Bitcoin balance
 */
async function getBitcoinBalance(address) {
  try {
    // Using Blockchain.info API
    const url = `${BLOCKCHAIN_INFO_API}/q/addressbalance/${address}`;
    
    const response = await fetch(url);
    const balanceSatoshis = await response.text();

    // Convert from Satoshis to BTC
    const balanceBtc = parseFloat(balanceSatoshis) / 1e8;

    return balanceBtc;
  } catch (error) {
    console.error('Error fetching Bitcoin balance:', error);
    
    // Fallback: Try BlockCypher API
    try {
      const url = `${BLOCKCYPHER_API}/btc/main/addrs/${address}/balance`;
      const response = await fetch(url);
      const data = await response.json();
      return (data.balance || 0) / 1e8;
    } catch (fallbackError) {
      console.error('Fallback API also failed:', fallbackError);
      return 0;
    }
  }
}

/**
 * Get Solana balance
 */
async function getSolanaBalance(address) {
  try {
    // Using public Solana RPC
    const rpcUrl = 'https://api.mainnet-beta.solana.com';
    
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getBalance',
        params: [address]
      })
    });

    const data = await response.json();
    const balanceLamports = data.result?.value || 0;

    // Convert from Lamports to SOL
    const balanceSol = balanceLamports / 1e9;

    return balanceSol;
  } catch (error) {
    console.error('Error fetching Solana balance:', error);
    return 0;
  }
}

/**
 * Get historical price data for charts
 */
export async function fetchHistoricalPrices(chain, days = 7) {
  try {
    const coinId = getCoinGeckoId(chain);
    const url = `${COINGECKO_API}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`;
    
    const response = await fetch(url);
    const data = await response.json();

    return data.prices || [];
  } catch (error) {
    console.error(`Error fetching historical prices for ${chain}:`, error);
    return [];
  }
}

/**
 * Helper: Get CoinGecko coin ID
 */
function getCoinGeckoId(chain) {
  const coinIds = {
    ethereum: 'ethereum',
    bitcoin: 'bitcoin',
    solana: 'solana'
  };
  return coinIds[chain] || chain;
}

/**
 * Test API connection
 */
export async function testApiConnection() {
  try {
    const response = await fetch(`${COINGECKO_API}/ping`);
    const data = await response.json();
    return data.gecko_says === '(V3) To the Moon!';
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
}
