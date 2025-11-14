// Import utilities
import { getWallets, addWallet, deleteWallet, updateLastUpdate } from '../utils/storage.js';
import { fetchWalletBalance, fetchCryptoPrice } from '../utils/api.js';
import { calculateTotalValue, formatCurrency, formatAddress } from '../utils/calculations.js';

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

// State
let wallets = [];

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadWallets();
  setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
  addWalletBtn.addEventListener('click', () => {
    addSection.classList.add('active');
    addressInput.focus();
  });

  cancelAddBtn.addEventListener('click', () => {
    addSection.classList.remove('active');
    clearInputs();
  });

  addAddressBtn.addEventListener('click', handleAddWallet);

  // Allow Enter key to submit
  addressInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleAddWallet();
  });
}

// Load Wallets
async function loadWallets() {
  try {
    loadingSpinner.classList.remove('hidden');
    wallets = await getWallets();
    
    if (wallets.length === 0) {
      emptyState.classList.remove('hidden');
      walletsList.innerHTML = '';
    } else {
      emptyState.classList.add('hidden');
      await renderWallets();
    }

    await updateTotalValue();
    updateLastUpdateTime();
  } catch (error) {
    console.error('Error loading wallets:', error);
    showError('Failed to load wallets');
  } finally {
    loadingSpinner.classList.add('hidden');
  }
}

// Render Wallets
async function renderWallets() {
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
    // Fetch balance and price
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

    // Event listeners
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
  const chain = chainSelect.value;
  const address = addressInput.value.trim();
  const label = labelInput.value.trim();

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

    await addWallet(newWallet);
    await loadWallets();
    
    addSection.classList.remove('active');
    clearInputs();
    showSuccess('Wallet added successfully!');
  } catch (error) {
    console.error('Error adding wallet:', error);
    showError('Failed to add wallet');
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
    const card = document.querySelector(`[data-id="${id}"]`).closest('.wallet-card');
    card.style.opacity = '0.5';

    const balance = await fetchWalletBalance(wallet.chain, wallet.address);
    const price = await fetchCryptoPrice(wallet.chain);
    
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

    totalValue.textContent = formatCurrency(total);
    
    // Mock change calculation (you can implement real 24h change tracking)
    const changePercent = 0;
    const changeValue = 0;
    
    if (changePercent >= 0) {
      totalChange.textContent = `+${formatCurrency(changeValue)} (+${changePercent.toFixed(2)}%)`;
      totalChange.className = 'total-change positive';
    } else {
      totalChange.textContent = `${formatCurrency(changeValue)} (${changePercent.toFixed(2)}%)`;
      totalChange.className = 'total-change negative';
    }
  } catch (error) {
    console.error('Error updating total value:', error);
    totalValue.textContent = '$--';
  }
}

// Helper Functions
function clearInputs() {
  addressInput.value = '';
  labelInput.value = '';
  chainSelect.value = 'ethereum';
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

function updateLastUpdateTime() {
  const now = new Date();
  lastUpdate.textContent = now.toLocaleTimeString();
}

function showError(message) {
  // Simple alert for now - you can make this fancier
  alert('❌ ' + message);
}

function showSuccess(message) {
  // Simple alert for now - you can make this fancier
  console.log('✅ ' + message);
}
