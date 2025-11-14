# 💰 Crypto Portfolio Tracker

A secure and privacy-focused Chrome/Firefox extension to track your cryptocurrency portfolio using **public addresses only**. No private keys, no risk.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Chrome](https://img.shields.io/badge/chrome-compatible-brightgreen.svg)
![Firefox](https://img.shields.io/badge/firefox-compatible-orange.svg)

## ✨ Features

- 🔒 **100% Safe** - Only uses public addresses (read-only)
- 💼 **Multi-Chain Support** - Ethereum, Bitcoin, Solana
- 📊 **Real-Time Prices** - Live cryptocurrency prices via CoinGecko
- 💰 **Total Portfolio Value** - See your complete portfolio value at a glance
- 📱 **Clean UI** - Beautiful gradient design with smooth animations
- 🔄 **Auto-Refresh** - Prices update automatically every 5 minutes
- 🗂️ **Multiple Wallets** - Track unlimited addresses across different chains
- 🏷️ **Custom Labels** - Name your wallets for easy identification
- 📈 **Balance Tracking** - See your crypto balances in real-time
- 🌐 **Local Storage Only** - All data stored locally on your device

## 🎯 Use Cases

- Track your crypto holdings across multiple wallets
- Monitor portfolio value without connecting wallets
- Check balances quickly from your browser
- Keep an eye on different blockchain addresses
- Perfect for investors, traders, and crypto enthusiasts

## 🔐 Security & Privacy

This extension is designed with security and privacy as top priorities:

- ✅ **No Private Keys** - Never asks for or stores private keys
- ✅ **Read-Only Access** - Can only view balances, cannot send transactions
- ✅ **Local Storage** - All data stored locally in your browser
- ✅ **No Analytics** - Zero tracking or data collection
- ✅ **Open Source** - Code is publicly auditable
- ✅ **Minimal Permissions** - Only requests necessary permissions

**Why it's safe:** Public addresses are like bank account numbers - anyone can see them, but they can't access your funds. You need private keys (like a password) to actually move crypto, which this extension never touches.

## 🚀 Installation

### Chrome Web Store (Coming Soon)
1. Visit the Chrome Web Store
2. Search for "Crypto Portfolio Tracker"
3. Click "Add to Chrome"

### Firefox Add-ons (Coming Soon)
1. Visit Firefox Add-ons
2. Search for "Crypto Portfolio Tracker"
3. Click "Add to Firefox"

### Manual Installation (Development)

#### Chrome/Edge
1. Clone this repository
   ```bash
   git clone https://github.com/yourusername/crypto-portfolio-tracker.git
   cd crypto-portfolio-tracker
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" (toggle in top-right)

4. Click "Load unpacked"

5. Select the extension folder

#### Firefox
1. Clone this repository
   ```bash
   git clone https://github.com/yourusername/crypto-portfolio-tracker.git
   cd crypto-portfolio-tracker
   ```

2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`

3. Click "Load Temporary Add-on"

4. Select the `manifest.json` file

## 📖 How to Use

### Adding Your First Wallet

1. Click the extension icon in your browser toolbar
2. Click the **"+ Add"** button
3. Select the blockchain (Ethereum, Bitcoin, or Solana)
4. Enter your **public address** (e.g., `0x123...abc` for Ethereum)
5. Optionally add a label (e.g., "Main Wallet", "Trading Account")
6. Click **"Add Address"**

### Managing Wallets

- **Refresh** - Click the refresh button to update a specific wallet
- **Delete** - Click the delete button to stop tracking a wallet
- **View Details** - Click on a wallet card to see more information

### Understanding the Display

- **Total Portfolio Value** - Sum of all your tracked wallets in USD
- **Balance** - Amount of crypto in each wallet
- **USD Value** - Current value of each wallet in US dollars
- **Last Updated** - When prices were last refreshed

## 🔧 Configuration

### API Keys (Optional)

For better rate limits, you can add your own free API keys:

1. **Etherscan API Key** (for Ethereum)
   - Get a free key at [etherscan.io/apis](https://etherscan.io/apis)
   - Edit `utils/api.js` and replace `ETHERSCAN_API_KEY`

2. **CoinGecko API** (for prices)
   - Free tier works great (50 calls/minute)
   - No key needed, but you can upgrade for more calls

### Settings (Future Feature)

- Currency selection (USD, EUR, GBP, etc.)
- Refresh interval adjustment
- Private mode (blur amounts)
- Price alerts

## 🛠️ Technical Details

### Tech Stack

- **Manifest V3** - Latest Chrome extension standard
- **Vanilla JavaScript** - No frameworks, lightweight and fast
- **CSS3** - Modern gradient design with animations
- **Chrome Storage API** - Local data persistence
- **Service Worker** - Background price updates

### Supported Chains

| Chain | Symbol | API Used | Status |
|-------|--------|----------|--------|
| Ethereum | ETH | Etherscan / RPC | ✅ Working |
| Bitcoin | BTC | Blockchain.info | ✅ Working |
| Solana | SOL | Solana RPC | ✅ Working |

### APIs Used

- **CoinGecko** - Cryptocurrency prices (free, no key required)
- **Etherscan** - Ethereum balances (free API key available)
- **Blockchain.info** - Bitcoin balances (free, no key required)
- **Solana RPC** - Solana balances (free, no key required)

## 📊 Roadmap

- [x] Basic wallet tracking (ETH, BTC, SOL)
- [x] Real-time price updates
- [x] Clean UI with animations
- [ ] Historical price charts
- [ ] More chains (Polygon, Avalanche, BSC)
- [ ] Token support (ERC-20, SPL)
- [ ] Price alerts
- [ ] Export/import data
- [ ] Dark/light theme toggle
- [ ] Multi-currency support
- [ ] NFT tracking

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

```bash
# Clone the repo
git clone https://github.com/yourusername/crypto-portfolio-tracker.git

# Navigate to the project
cd crypto-portfolio-tracker

# Load the extension in Chrome
# Go to chrome://extensions/
# Enable Developer mode
# Click "Load unpacked" and select the folder
```

## 🐛 Bug Reports

Found a bug? Please open an issue on GitHub with:
- Description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser version

## 💬 FAQ

**Q: Is this extension safe?**  
A: Yes! It only uses public addresses which are read-only. Your private keys and funds are never at risk.

**Q: Why do I need to provide API keys?**  
A: The extension works without API keys using public endpoints. API keys (all free) just give you better rate limits.

**Q: Can this extension steal my crypto?**  
A: No. It's impossible. The extension only reads public information and never has access to your private keys.

**Q: Does this work with hardware wallets?**  
A: Yes! Just add your hardware wallet's public address.

**Q: Can I track tokens (not just native coins)?**  
A: Not yet, but it's on the roadmap! Coming soon.

**Q: Is my data sent anywhere?**  
A: No. Everything is stored locally in your browser. Zero data collection.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Created with ❤️ by Thomas


## 🌟 Show Your Support

If you find this extension useful, please:
- ⭐ Star this repository
- 🐛 Report bugs
- 💡 Suggest features
- 🔀 Submit pull requests

## 📞 Support

Need help? Have questions?



---

**Disclaimer:** This extension is provided as-is for tracking purposes only. Always verify your balances on official blockchain explorers. Not financial advice.

Made with 💜 for the crypto community
