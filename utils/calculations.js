/**
 * Calculate total portfolio value
 */
export function calculateTotalValue(wallets, balances, prices) {
  let total = 0;

  wallets.forEach((wallet, index) => {
    const balance = balances[index] || 0;
    const price = prices[wallet.chain] || 0;
    total += balance * price;
  });

  return total;
}

/**
 * Calculate portfolio distribution
 */
export function calculateDistribution(wallets, balances, prices) {
  const total = calculateTotalValue(wallets, balances, prices);
  
  if (total === 0) return [];

  return wallets.map((wallet, index) => {
    const balance = balances[index] || 0;
    const price = prices[wallet.chain] || 0;
    const value = balance * price;
    const percentage = (value / total) * 100;

    return {
      chain: wallet.chain,
      value,
      percentage: percentage.toFixed(2)
    };
  });
}

/**
 * Calculate gains/losses
 * Note: This requires storing purchase prices, which isn't implemented yet
 */
export function calculateGainLoss(currentValue, purchaseValue) {
  const difference = currentValue - purchaseValue;
  const percentChange = ((difference / purchaseValue) * 100).toFixed(2);

  return {
    difference,
    percentChange,
    isProfit: difference >= 0
  };
}

/**
 * Format currency (USD)
 */
export function formatCurrency(amount, currency = 'USD') {
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

/**
 * Format cryptocurrency amount
 */
export function formatCrypto(amount, decimals = 6) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0';
  }

  // For very small amounts, use more decimals
  if (amount < 0.000001 && amount > 0) {
    return amount.toExponential(4);
  }

  return parseFloat(amount).toFixed(decimals);
}

/**
 * Format large numbers (K, M, B)
 */
export function formatLargeNumber(num) {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(2) + 'B';
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + 'M';
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(2) + 'K';
  }
  return num.toFixed(2);
}

/**
 * Shorten address for display
 */
export function formatAddress(address, startChars = 6, endChars = 4) {
  if (!address) return '';
  
  if (address.length <= startChars + endChars) {
    return address;
  }

  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Validate Ethereum address
 */
export function isValidEthAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate Bitcoin address
 */
export function isValidBtcAddress(address) {
  // Supports legacy, SegWit, and native SegWit (Bech32)
  return /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,90}$/.test(address);
}

/**
 * Validate Solana address
 */
export function isValidSolAddress(address) {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

/**
 * Calculate percentage change
 */
export function calculatePercentChange(oldValue, newValue) {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Format percentage
 */
export function formatPercent(value, decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) {
    return '0.00%';
  }
  
  const formatted = parseFloat(value).toFixed(decimals);
  return `${formatted}%`;
}

/**
 * Format timestamp to readable date
 */
export function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Calculate time ago
 */
export function timeAgo(timestamp) {
  const now = Date.now();
  const diff = now - new Date(timestamp).getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}

/**
 * Sort wallets by value
 */
export function sortWalletsByValue(wallets, balances, prices, descending = true) {
  const walletsWithValue = wallets.map((wallet, index) => {
    const balance = balances[index] || 0;
    const price = prices[wallet.chain] || 0;
    return {
      ...wallet,
      value: balance * price
    };
  });

  return walletsWithValue.sort((a, b) => {
    return descending ? b.value - a.value : a.value - b.value;
  });
}

/**
 * Convert Wei to ETH
 */
export function weiToEth(wei) {
  return parseFloat(wei) / 1e18;
}

/**
 * Convert Satoshis to BTC
 */
export function satoshiToBtc(satoshi) {
  return parseFloat(satoshi) / 1e8;
}

/**
 * Convert Lamports to SOL
 */
export function lamportsToSol(lamports) {
  return parseFloat(lamports) / 1e9;
}

/**
 * Generate random color (for charts)
 */
export function generateColor(index) {
  const colors = [
    '#667eea', // Purple
    '#764ba2', // Dark purple
    '#f093fb', // Pink
    '#4facfe', // Blue
    '#43e97b', // Green
    '#fa709a', // Rose
    '#fee140', // Yellow
    '#30cfd0'  // Cyan
  ];
  
  return colors[index % colors.length];
}

/**
 * Debounce function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Deep clone object
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if value is empty
 */
export function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}
