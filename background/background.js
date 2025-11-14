// Background service worker for Crypto Portfolio Tracker
// Compatible with both Chrome (Manifest V3) and Firefox (Manifest V2)

// Detect browser environment
const isFirefox = typeof browser !== 'undefined';
const browserAPI = isFirefox ? browser : chrome;

// Initialize extension
browserAPI.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Crypto Portfolio Tracker installed!');
    
    // Set default settings
    browserAPI.storage.local.set({
      crypto_settings: {
        currency: 'USD',
        refreshInterval: 5,
        notifications: true,
        privateMode: false
      }
    });

    // Open welcome page
    browserAPI.tabs.create({
      url: 'https://github.com/yourusername/crypto-portfolio-tracker'
    });
  } else if (details.reason === 'update') {
    console.log('Crypto Portfolio Tracker updated!');
  }
});

// Set up periodic refresh alarm
browserAPI.alarms.create('refreshPrices', {
  periodInMinutes: 5 // Refresh every 5 minutes
});

// Handle alarm
browserAPI.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'refreshPrices') {
    refreshAllPrices();
  }
});

// Refresh all prices
async function refreshAllPrices() {
  try {
    const result = await browserAPI.storage.local.get(['crypto_wallets']);
    const wallets = result.crypto_wallets || [];

    if (wallets.length === 0) return;

    // Update last refresh time
    await browserAPI.storage.local.set({
      last_update: new Date().toISOString()
    });

    console.log('Prices refreshed at', new Date().toLocaleTimeString());
  } catch (error) {
    console.error('Error refreshing prices:', error);
  }
}

// Handle messages from popup
browserAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'refreshNow') {
    refreshAllPrices().then(() => {
      sendResponse({ success: true });
    }).catch((error) => {
      sendResponse({ success: false, error: error.message });
    });
    return true; // Keep message channel open for async response
  }

  if (request.action === 'getPrices') {
    // Handle price requests
    sendResponse({ success: true, data: {} });
    return true;
  }
});

// Handle browser action click (if needed)
const actionAPI = browserAPI.action || browserAPI.browserAction;
if (actionAPI && actionAPI.onClicked) {
  actionAPI.onClicked.addListener((tab) => {
  // Extension popup will open automatically
  console.log('Extension icon clicked');
});
}

// Monitor storage changes
browserAPI.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local') {
    if (changes.crypto_wallets) {
      console.log('Wallets updated:', changes.crypto_wallets.newValue);
    }
    if (changes.crypto_settings) {
      console.log('Settings updated:', changes.crypto_settings.newValue);
      
      // Update alarm interval if refresh interval changed
      const newSettings = changes.crypto_settings.newValue;
      if (newSettings && newSettings.refreshInterval) {
        browserAPI.alarms.clear('refreshPrices', () => {
          browserAPI.alarms.create('refreshPrices', {
            periodInMinutes: newSettings.refreshInterval
          });
        });
      }
    }
  }
});

// Price alert system (future feature)
async function checkPriceAlerts() {
  try {
    const result = await browserAPI.storage.local.get(['price_alerts', 'crypto_settings']);
    const alerts = result.price_alerts || [];
    const settings = result.crypto_settings || {};

    if (!settings.notifications || alerts.length === 0) return;

    // Check each alert
    for (const alert of alerts) {
      // Fetch current price and compare
      // If condition met, send notification
      // This is a placeholder for future implementation
    }
  } catch (error) {
    console.error('Error checking price alerts:', error);
  }
}

// Keep service worker alive
let keepAliveInterval;

function keepAlive() {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
  }
  
  keepAliveInterval = setInterval(() => {
    console.log('Keep alive ping');
  }, 20000); // Ping every 20 seconds
}

// Start keep alive on installation
keepAlive();

// Re-establish keep alive on wakeup
browserAPI.runtime.onStartup.addListener(() => {
  console.log('Extension started');
  keepAlive();
});

// Log any errors
self.addEventListener('error', (event) => {
  console.error('Service worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

console.log('Crypto Portfolio Tracker background service worker loaded');
