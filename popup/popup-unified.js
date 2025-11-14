// Crypto Portfolio Tracker - Main Script
// All-in-one version for Firefox compatibility

// Detect browser environment
const isFirefox = typeof browser !== 'undefined';
const browserAPI = isFirefox ? browser : chrome;

// ==================== STORAGE UTILITIES ====================

const WALLETS_KEY = 'crypto_wallets';
const SETTINGS_KEY = 'crypto_settings';
const LAST_UPDATE_KEY = 'last_update';

async function getWallets() {
  try {
    const result = await browserAPI.storage.local.get([WALLETS_KEY]);
    return result[WALLETS_KEY] || [];
  } catch (error) {
    console.error('Error getting wallets:', error);
    return [];
  }
}

async function addWallet(wallet) {
  try {
    const wallets = await getWallets();
    const exists = wallets.some(w => 
      w.address.toLowerCase() === wallet.address.toLowerCase() && 
      w.chain === wallet.chain
    );
    if (exists) {
      throw new Error('This address is already being tracked');
    }
    wallets.push(wallet);
    await browserAPI.storage.local.set({ [WALLETS_KEY]: wallets });
    return wallet;
  } catch (error) {
    console.error('Error adding wallet:', error);
    throw error;
  }
}

async function deleteWallet(id) {
  try {
    const wallets = await getWallets();
    const filtered = wallets.filter(w => w.id !== id);
    await browserAPI.storage.local.set({ [WALLETS_KEY]: filtered });
    return true;
  } catch (error) {
    console.error('Error deleting wallet:', error);
    throw error;
  }
}

async function updateLastUpdate() {
  try {
    const timestamp = new Date().toISOString();
    await browserAPI.storage.local.set({ [LAST_UPDATE_KEY]: timestamp });
    return timestamp;
  } catch (error) {
    console.error('Error updating last update:', error);
    throw error;
  }
}

// ==================== API UTILITIES ====================

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const ETHERSCAN_API = 'https://api.etherscan.io/api';
const ETHERSCAN_API_KEY = 'YourApiKeyHere';
const BLOCKCHAIN_INFO_API = 'https://blockchain.info';

let priceCache = {};
const CACHE_DURATION = 5 * 60 * 1000;

async function fetchWalletBalance(chain, address) {
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

async function fetchCryptoPrice(chain) {
  const cacheKey = `price_${chain}`;
  const cached = priceCache[cacheKey];
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
    priceCache[cacheKey] = { price, timestamp: Date.now() };
    return price;
  } catch (error) {
    console.error(`Error fetching price for ${chain}:`, error);
    return 0;
  }
}

async function getEthereumBalance(address) {
  try {
    const url = `${ETHERSCAN_API}?module=account&action=balance&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.status !== '1') {
      throw new Error(data.message || 'Etherscan API error');
    }
    const balanceWei = data.result;
    return parseFloat(balanceWei) / 1e18;
  } catch (error) {
    console.error('Error fetching Ethereum balance:', error);
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

async function getBitcoinBalance(address) {
  try {
    const url = `${BLOCKCHAIN_INFO_API}/q/addressbalance/${address}`;
    const response = await fetch(url);
    const balanceSatoshis = await response.text();
    return parseFloat(balanceSatoshis) / 1e8;
  } catch (error) {
    console.error('Error fetching Bitcoin balance:', error);
    return 0;
  }
}

async function getSolanaBalance(address) {
  try {
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
    return balanceLamports / 1e9;
  } catch (error) {
    console.error('Error fetching Solana balance:', error);
    return 0;
  }
}

function getCoinGeckoId(chain) {
  const coinIds = {
    ethereum: 'ethereum',
    bitcoin: 'bitcoin',
    solana: 'solana'
  };
  return coinIds[chain] || chain;
}

// ==================== CALCULATION UTILITIES ====================

function formatCurrency(amount, currency = 'USD') {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '$0.00';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

function formatAddress(address, startChars = 6, endChars = 4) {
  if (!address) return '';
  if (address.length <= startChars + endChars) {
    return address;
  }
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

function isValidAddress(chain, address) {
  switch (chain) {
    case 'ethereum':
      return /^0x[a-fA-F0-9]{40}$/.test(address);
    case 'bitcoin':
      return /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,90}$/.test(address);
    case 'solana':
      return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
    default:
      return false;
  }
}

function getChainSymbol(chain) {
  const symbols = {
    ethereum: 'ETH',
    bitcoin: 'BTC',
    solana: 'SOL'
  };
  return symbols[chain] || chain.toUpperCase();
}

// ==================== MAIN APPLICATION ====================

// DOM Elements
const addSection = document.getElementById('addSection');
const addWalletBtn = document.getElementById('addWalletBtn');
const addAddressBtn = document.getElementById('addAddressBtn');
const cancelAddBtn = document.getElementById('cancelAddBtn');
const chainSelect = document.getElementById('chainSelect');
const addressInput = document.getElementById('addressInput');
const labelInput = document.getElementById('labelInput');
const walletsList = document.getElementById('walletsList');
const emptyState = document.getElementById('emptyState');
const totalValue = document.getElementById('totalValue');
const totalChange = document.getElementById('totalChange');
const lastUpdate = document.getElementById('lastUpdate');
const loadingSpinner = document.getElementById('loadingSpinner');
const settingsBtn = document.getElementById('settingsBtn');

// State
let wallets = [];

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Extension loaded!');
  await loadWallets();
  setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
  if (addWalletBtn) {
    addWalletBtn.addEventListener('click', () => {
      console.log('Add wallet clicked');
      addSection.classList.add('active');
      addressInput.focus();
    });
  }

  if (cancelAddBtn) {
    cancelAddBtn.addEventListener('click', () => {
      console.log('Cancel clicked');
      addSection.classList.remove('active');
      clearInputs();
    });
  }

  if (addAddressBtn) {
    addAddressBtn.addEventListener('click', handleAddWallet);
  }

  if (addressInput) {
    addressInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleAddWallet();
    });
  }

  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      alert('Settings coming soon! 🚀');
    });
  }
}

// Load Wallets
async function loadWallets() {
  try {
    console.log('Loading wallets...');
    if (loadingSpinner) loadingSpinner.classList.remove('hidden');
    
    wallets = await getWallets();
    console.log('Wallets loaded:', wallets.length);
    
    if (wallets.length === 0) {
      if (emptyState) emptyState.classList.remove('hidden');
      if (walletsList) walletsList.innerHTML = '';
    } else {
      if (emptyState) emptyState.classList.add('hidden');
      await renderWallets();
    }

    await updateTotalValue();
    updateLastUpdateTime();
  } catch (error) {
    console.error('Error loading wallets:', error);
    showError('Failed to load wallets');
  } finally {
    if (loadingSpinner) loadingSpinner.classList.add('hidden');
  }
}

// Render Wallets
async function renderWallets() {
  if (!walletsList) return;
  walletsList.innerHTML = '';

  for (const wallet of wallets) {
    const card = await createWalletCard(wallet);
    walletsList.appendChild(card);
  }
}

// Create Wallet Card
async function createWalletCard(wallet) {
  const card = document.createElement('div');
  card.className = 'wallet-card';

  try {
    console.log('Fetching data for wallet:', wallet.label);
    const balance = await fetchWalletBalance(wallet.chain, wallet.address);
    const price = await fetchCryptoPrice(wallet.chain);
    const valueUSD = balance * price;

    card.innerHTML = `
      <div class="wallet-header">
        <div class="wallet-label">${wallet.label || 'Unnamed Wallet'}</div>
        <div class="wallet-chain">${wallet.chain.toUpperCase()}</div>
      </div>
      <div class="wallet-address">${formatAddress(wallet.address)}</div>
      <div class="wallet-balance">
        <div class="balance-crypto">${balance.toFixed(6)} ${getChainSymbol(wallet.chain)}</div>
        <div class="balance-usd">${formatCurrency(valueUSD)}</div>
      </div>
      <div class="wallet-actions">
        <button class="wallet-btn refresh" data-id="${wallet.id}">🔄 Refresh</button>
        <button class="wallet-btn delete" data-id="${wallet.id}">🗑️ Delete</button>
      </div>
    `;

    card.querySelector('.refresh').addEventListener('click', (e) => {
      e.stopPropagation();
      refreshWallet(wallet.id);
    });

    card.querySelector('.delete').addEventListener('click', (e) => {
      e.stopPropagation();
      handleDeleteWallet(wallet.id);
    });

  } catch (error) {
    console.error(`Error loading wallet ${wallet.id}:`, error);
    card.innerHTML = `
      <div class="wallet-header">
        <div class="wallet-label">${wallet.label || 'Unnamed Wallet'}</div>
        <div class="wallet-chain">${wallet.chain.toUpperCase()}</div>
      </div>
      <div class="wallet-address">${formatAddress(wallet.address)}</div>
      <div class="balance-crypto" style="color: #f87171;">Failed to load</div>
      <div class="wallet-actions">
        <button class="wallet-btn refresh" data-id="${wallet.id}">🔄 Retry</button>
        <button class="wallet-btn delete" data-id="${wallet.id}">🗑️ Delete</button>
      </div>
    `;

    card.querySelector('.refresh').addEventListener('click', () => refreshWallet(wallet.id));
    card.querySelector('.delete').addEventListener('click', () => handleDeleteWallet(wallet.id));
  }

  return card;
}

// Handle Add Wallet
async function handleAddWallet() {
  console.log('handleAddWallet called');
  
  const chain = chainSelect.value;
  const address = addressInput.value.trim();
  const label = labelInput.value.trim();

  console.log('Chain:', chain, 'Address:', address, 'Label:', label);

  if (!address) {
    showError('Please enter an address');
    return;
  }

  if (!isValidAddress(chain, address)) {
    showError('Invalid address format');
    return;
  }

  try {
    addAddressBtn.disabled = true;
    addAddressBtn.textContent = 'Adding...';

    const newWallet = {
      id: Date.now().toString(),
      chain,
      address,
      label: label || `${chain.charAt(0).toUpperCase() + chain.slice(1)} Wallet`,
      addedAt: new Date().toISOString()
    };

    console.log('Adding wallet:', newWallet);
    await addWallet(newWallet);
    await loadWallets();
    
    addSection.classList.remove('active');
    clearInputs();
    showSuccess('Wallet added successfully!');
  } catch (error) {
    console.error('Error adding wallet:', error);
    showError('Failed to add wallet: ' + error.message);
  } finally {
    addAddressBtn.disabled = false;
    addAddressBtn.textContent = 'Add Address';
  }
}

// Handle Delete Wallet
async function handleDeleteWallet(id) {
  if (confirm('Are you sure you want to remove this wallet from tracking?')) {
    try {
      await deleteWallet(id);
      await loadWallets();
      showSuccess('Wallet removed');
    } catch (error) {
      console.error('Error deleting wallet:', error);
      showError('Failed to delete wallet');
    }
  }
}

// Refresh Wallet
async function refreshWallet(id) {
  const wallet = wallets.find(w => w.id === id);
  if (!wallet) return;

  try {
    const card = document.querySelector(`[data-id="${id}"]`)?.closest('.wallet-card');
    if (card) card.style.opacity = '0.5';

    await loadWallets();
    showSuccess('Wallet refreshed');
  } catch (error) {
    console.error('Error refreshing wallet:', error);
    showError('Failed to refresh wallet');
  }
}

// Update Total Value
async function updateTotalValue() {
  try {
    let total = 0;

    for (const wallet of wallets) {
      const balance = await fetchWalletBalance(wallet.chain, wallet.address);
      const price = await fetchCryptoPrice(wallet.chain);
      total += balance * price;
    }

    if (totalValue) totalValue.textContent = formatCurrency(total);
    
    const changePercent = 0;
    const changeValue = 0;
    
    if (totalChange) {
      if (changePercent >= 0) {
        totalChange.textContent = `+${formatCurrency(changeValue)} (+${changePercent.toFixed(2)}%)`;
        totalChange.className = 'total-change positive';
      } else {
        totalChange.textContent = `${formatCurrency(changeValue)} (${changePercent.toFixed(2)}%)`;
        totalChange.className = 'total-change negative';
      }
    }
  } catch (error) {
    console.error('Error updating total value:', error);
    if (totalValue) totalValue.textContent = '$--';
  }
}

// Helper Functions
function clearInputs() {
  if (addressInput) addressInput.value = '';
  if (labelInput) labelInput.value = '';
  if (chainSelect) chainSelect.value = 'ethereum';
}

function updateLastUpdateTime() {
  const now = new Date();
  if (lastUpdate) lastUpdate.textContent = now.toLocaleTimeString();
}

function showError(message) {
  alert('❌ ' + message);
  console.error(message);
}

function showSuccess(message) {
  console.log('✅ ' + message);
}

console.log('Popup script loaded successfully!');
