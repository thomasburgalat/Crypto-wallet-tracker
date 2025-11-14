# 📥 Installation Guide

This guide will help you install the Crypto Portfolio Tracker extension in your browser.

## 🌐 Chrome / Edge / Brave

### Method 1: Chrome Web Store (Recommended - Coming Soon)
1. Visit the [Chrome Web Store](https://chrome.google.com/webstore)
2. Search for "Crypto Portfolio Tracker"
3. Click **"Add to Chrome"**
4. Click **"Add Extension"** in the popup
5. Done! Click the extension icon in your toolbar

### Method 2: Manual Installation (For Developers)

1. **Download the extension**
   - Download and unzip the `crypto-portfolio-tracker.zip` file
   - Or clone from GitHub:
     ```bash
     git clone https://github.com/yourusername/crypto-portfolio-tracker.git
     ```

2. **Open Extensions page**
   - Open Chrome/Edge/Brave
   - Navigate to `chrome://extensions/`
   - Or click the puzzle icon (extensions) → "Manage Extensions"

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the extension**
   - Click **"Load unpacked"**
   - Select the `crypto-portfolio-tracker` folder
   - The extension should now appear in your list

5. **Pin the extension**
   - Click the puzzle icon (extensions) in your toolbar
   - Find "Crypto Portfolio Tracker"
   - Click the pin icon to keep it visible

## 🦊 Firefox

### Method 1: Firefox Add-ons (Recommended - Coming Soon)
1. Visit [Firefox Add-ons](https://addons.mozilla.org)
2. Search for "Crypto Portfolio Tracker"
3. Click **"Add to Firefox"**
4. Click **"Add"** in the popup
5. Done! Click the extension icon in your toolbar

### Method 2: Temporary Installation (For Developers)

1. **Download the extension**
   - Download and unzip the `crypto-portfolio-tracker.zip` file
   - Or clone from GitHub:
     ```bash
     git clone https://github.com/yourusername/crypto-portfolio-tracker.git
     ```

2. **Open Debugging page**
   - Open Firefox
   - Navigate to `about:debugging#/runtime/this-firefox`
   - Or click Menu → More Tools → Extensions & Themes → Debug Add-ons

3. **Load the extension**
   - Click **"Load Temporary Add-on..."**
   - Navigate to the extension folder
   - Select the `manifest.json` file
   - The extension is now loaded

**Note:** Temporary add-ons in Firefox are removed when you close the browser. For permanent installation, wait for the official Firefox Add-ons release.

## 🔧 First-Time Setup

After installation:

1. **Click the extension icon** in your toolbar
2. **Click "+ Add"** to add your first wallet
3. **Select a blockchain** (Ethereum, Bitcoin, or Solana)
4. **Enter your public address**
   - Ethereum: starts with `0x...`
   - Bitcoin: starts with `bc1...`, `1...`, or `3...`
   - Solana: base58 encoded address
5. **Add a label** (optional) like "Main Wallet"
6. Click **"Add Address"**

That's it! Your portfolio will now be tracked.

## 🔑 Optional: Adding API Keys

For better rate limits and faster updates, you can add free API keys:

### Etherscan API Key (for Ethereum)

1. Go to [etherscan.io/apis](https://etherscan.io/apis)
2. Sign up for a free account
3. Generate a new API key
4. Open the extension folder
5. Edit `utils/api.js`
6. Replace `YourApiKeyHere` with your actual key:
   ```javascript
   const ETHERSCAN_API_KEY = 'YOUR_ACTUAL_KEY_HERE';
   ```
7. Save and reload the extension

**Note:** This step is optional. The extension works without API keys using public endpoints.

## 🆘 Troubleshooting

### Extension not showing up?
- Make sure Developer Mode is enabled
- Try refreshing the extensions page
- Check browser console for errors (F12)

### Can't add wallets?
- Verify the address format is correct
- Check that you selected the right blockchain
- Make sure you're entering a PUBLIC address, not a private key

### Prices not loading?
- Check your internet connection
- Verify the extension has permission to access APIs
- Try refreshing the extension

### Extension icon is gray?
- Click the puzzle icon and pin the extension
- Reload the extensions page

## 🔄 Updating the Extension

### From Web Store
- Extensions update automatically
- Or go to `chrome://extensions/` and click "Update"

### Manual Updates
1. Download the new version
2. Go to `chrome://extensions/`
3. Click "Remove" on the old version
4. Load the new version using "Load unpacked"

## 🗑️ Uninstalling

### Chrome/Edge/Brave
1. Go to `chrome://extensions/`
2. Find "Crypto Portfolio Tracker"
3. Click **"Remove"**
4. Confirm removal

### Firefox
1. Go to `about:addons`
2. Find "Crypto Portfolio Tracker"
3. Click the three dots
4. Click **"Remove"**

**Your data is stored locally, so uninstalling will delete your wallet list.**

## 🔒 Security Tips

- ✅ Only add PUBLIC addresses
- ✅ Verify you're on the official GitHub/store page
- ✅ Check the extension permissions before installing
- ❌ NEVER enter your private keys or seed phrase
- ❌ Don't download from untrusted sources

## 📞 Need Help?

- Check the [FAQ](README.md#-faq) in the README
- Open an issue on [GitHub](https://github.com/yourusername/crypto-portfolio-tracker/issues)
- Email: your.email@example.com

---

Happy tracking! 🚀💰
