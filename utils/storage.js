// Storage keys
const WALLETS_KEY = 'crypto_wallets';
const SETTINGS_KEY = 'crypto_settings';
const LAST_UPDATE_KEY = 'last_update';

/**
 * Get all wallets from storage
 */
export async function getWallets() {
  try {
    const result = await chrome.storage.local.get([WALLETS_KEY]);
    return result[WALLETS_KEY] || [];
  } catch (error) {
    console.error('Error getting wallets:', error);
    return [];
  }
}

/**
 * Add a new wallet
 */
export async function addWallet(wallet) {
  try {
    const wallets = await getWallets();
    
    // Check if address already exists
    const exists = wallets.some(w => 
      w.address.toLowerCase() === wallet.address.toLowerCase() && 
      w.chain === wallet.chain
    );

    if (exists) {
      throw new Error('This address is already being tracked');
    }

    wallets.push(wallet);
    await chrome.storage.local.set({ [WALLETS_KEY]: wallets });
    
    return wallet;
  } catch (error) {
    console.error('Error adding wallet:', error);
    throw error;
  }
}

/**
 * Update an existing wallet
 */
export async function updateWallet(id, updates) {
  try {
    const wallets = await getWallets();
    const index = wallets.findIndex(w => w.id === id);

    if (index === -1) {
      throw new Error('Wallet not found');
    }

    wallets[index] = { ...wallets[index], ...updates };
    await chrome.storage.local.set({ [WALLETS_KEY]: wallets });

    return wallets[index];
  } catch (error) {
    console.error('Error updating wallet:', error);
    throw error;
  }
}

/**
 * Delete a wallet
 */
export async function deleteWallet(id) {
  try {
    const wallets = await getWallets();
    const filtered = wallets.filter(w => w.id !== id);
    
    await chrome.storage.local.set({ [WALLETS_KEY]: filtered });
    
    return true;
  } catch (error) {
    console.error('Error deleting wallet:', error);
    throw error;
  }
}

/**
 * Get wallet by ID
 */
export async function getWalletById(id) {
  try {
    const wallets = await getWallets();
    return wallets.find(w => w.id === id) || null;
  } catch (error) {
    console.error('Error getting wallet by ID:', error);
    return null;
  }
}

/**
 * Clear all wallets
 */
export async function clearAllWallets() {
  try {
    await chrome.storage.local.set({ [WALLETS_KEY]: [] });
    return true;
  } catch (error) {
    console.error('Error clearing wallets:', error);
    throw error;
  }
}

/**
 * Get settings
 */
export async function getSettings() {
  try {
    const result = await chrome.storage.local.get([SETTINGS_KEY]);
    return result[SETTINGS_KEY] || {
      currency: 'USD',
      refreshInterval: 5, // minutes
      notifications: true,
      privateMode: false
    };
  } catch (error) {
    console.error('Error getting settings:', error);
    return {};
  }
}

/**
 * Update settings
 */
export async function updateSettings(settings) {
  try {
    const current = await getSettings();
    const updated = { ...current, ...settings };
    await chrome.storage.local.set({ [SETTINGS_KEY]: updated });
    return updated;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
}

/**
 * Get last update timestamp
 */
export async function getLastUpdate() {
  try {
    const result = await chrome.storage.local.get([LAST_UPDATE_KEY]);
    return result[LAST_UPDATE_KEY] || null;
  } catch (error) {
    console.error('Error getting last update:', error);
    return null;
  }
}

/**
 * Update last update timestamp
 */
export async function updateLastUpdate() {
  try {
    const timestamp = new Date().toISOString();
    await chrome.storage.local.set({ [LAST_UPDATE_KEY]: timestamp });
    return timestamp;
  } catch (error) {
    console.error('Error updating last update:', error);
    throw error;
  }
}

/**
 * Export all data (for backup)
 */
export async function exportData() {
  try {
    const wallets = await getWallets();
    const settings = await getSettings();
    
    return {
      wallets,
      settings,
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    };
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
}

/**
 * Import data (from backup)
 */
export async function importData(data) {
  try {
    if (data.wallets) {
      await chrome.storage.local.set({ [WALLETS_KEY]: data.wallets });
    }
    if (data.settings) {
      await chrome.storage.local.set({ [SETTINGS_KEY]: data.settings });
    }
    
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    throw error;
  }
}

/**
 * Get storage usage statistics
 */
export async function getStorageStats() {
  try {
    const result = await chrome.storage.local.get(null);
    const bytes = new Blob([JSON.stringify(result)]).size;
    const quota = chrome.storage.local.QUOTA_BYTES || 5242880; // 5MB default

    return {
      bytesUsed: bytes,
      bytesTotal: quota,
      percentUsed: (bytes / quota * 100).toFixed(2)
    };
  } catch (error) {
    console.error('Error getting storage stats:', error);
    return null;
  }
}
