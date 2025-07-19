# Konnyaku Translator 🌐

A powerful Chrome extension for instant text translation using Google's Gemini API. Select any text on any webpage and get instant translations with a sleek floating interface and full internationalization support.

## ✨ Features

- **🎯 Smart Positioning**: Floating button appears precisely at your mouse cursor position
- **🌍 Multi-language Support**: 15 translation languages and 5 UI languages
- **⚡ Instant Translation**: Real-time translation powered by Google Gemini 2.5 Flash Lite
- **🎨 Modern UI**: Clean, intuitive interface built with Vue.js 3 and Tailwind CSS
- **🌐 Internationalization**: Full UI support for English, 繁體中文, 简体中文, 日本語, 한국어
- **⚙️ Easy Setup**: Simple API key configuration with intuitive settings page
- **💾 Persistent Settings**: Your language preferences and UI settings are automatically saved
- **🛡️ Isolated Styling**: Shadow DOM prevents conflicts with host websites

## 🚀 Quick Start

### Installation

1. **Build the extension**
   ```bash
   bun install
   bun run build
   ```

2. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` folder

3. **Get API Key**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Generate a new API key
   - Click the extension icon → Settings
   - Enter your API key and save

## 🎮 How to Use

1. **Select text** on any webpage
2. **Click the floating button** that appears near your cursor
3. **Choose target language** from the dropdown
4. **Get instant translation** powered by AI

### Pro Tips
- The translation popup shows your preferred language by default
- Use the settings button (⚙️) to configure API key and preferences
- The extension works on any website with selectable text

## 🛠️ Development

### Tech Stack
- **Vue.js 3** with Composition API
- **Vite 6.0** for lightning-fast builds
- **Tailwind CSS v4.0** for utility-first styling
- **Google Gemini 2.5 Flash Lite Preview** for AI translation
- **Chrome Extension Manifest V3**
- **Custom i18n** for internationalization

### Build Commands
```bash
# Development with hot reload
bun run dev

# Production build
bun run build

# Preview build
bun run preview
```

### Project Structure
```
src/
├── content.js          # Content script with Shadow DOM
├── content.css         # Isolated styles for content script
├── background.js       # Service worker for API calls
├── popup.js           # Extension popup initialization
├── options.js         # Settings page initialization
├── components/
│   ├── PopupApp.vue   # Popup component (redirects to options)
│   └── OptionsApp.vue # Full-featured settings component
└── i18n/
    ├── content-i18n.js # Content script internationalization
    ├── locales.js      # Translation strings for all languages
    └── useI18n.js      # Vue.js i18n composable
```

## 🌐 Supported Languages

### Translation Languages
- 🇹🇼 繁體中文 (Traditional Chinese)
- 🇨🇳 简体中文 (Simplified Chinese)
- 🇯🇵 日本語 (Japanese)
- 🇰🇷 한국어 (Korean)
- 🇺🇸 English
- 🇪🇸 Español (Spanish)
- 🇫🇷 Français (French)
- 🇩🇪 Deutsch (German)
- 🇮🇹 Italiano (Italian)
- 🇵🇹 Português (Portuguese)
- 🇷🇺 Русский (Russian)
- 🇸🇦 العربية (Arabic)
- 🇮🇳 हिन्दी (Hindi)
- 🇹🇭 ไทย (Thai)
- 🇻🇳 Tiếng Việt (Vietnamese)

### UI Languages
- 🇺🇸 English
- 🇹🇼 繁體中文 (Traditional Chinese)
- 🇨🇳 简体中文 (Simplified Chinese)
- 🇯🇵 日本語 (Japanese)
- 🇰🇷 한국어 (Korean)

## 📋 Requirements

- Chrome 88+ or any Chromium-based browser
- Google Gemini API key (free tier available)
- Internet connection for translations

## 🔧 Configuration

### API Setup
1. Get your free API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click the extension icon in your browser toolbar
3. You'll be redirected to the settings page
4. Enter your API key in the secure password field
5. Select your preferred languages from the checkbox list
6. Choose your UI language for the interface
7. Click Save and start translating!

### Permissions
The extension requires minimal permissions:
- `activeTab`: Access current webpage content
- `storage`: Save your preferences locally
- `contextMenus`: Future right-click menu support
- Host permission for Google's API endpoint

## 🐛 Troubleshooting

### Common Issues

**Extension not loading?**
- Ensure you've run `bun run build` first
- Check that all files exist in the `dist` folder
- Look for error messages in Chrome's extension page

**Translations not working?**
- Verify your API key is correctly entered in settings
- Check your internet connection
- Ensure you haven't exceeded API rate limits
- Try selecting a different target language

**Button not appearing?**
- Some websites block content scripts (e.g., Chrome Web Store)
- Try selecting text with your mouse (not keyboard)
- Check if Shadow DOM is properly initialized
- Refresh the page and try again

**UI in wrong language?**
- Go to settings and select your preferred UI language
- The extension auto-detects browser language on first install

## 📖 Documentation

For detailed technical documentation, architecture details, and contribution guidelines, see [CLAUDE.md](./CLAUDE.md).

## 🤝 Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following our code style
4. Test thoroughly on multiple websites
5. Commit with clear messages (`git commit -m 'Add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Submit a pull request

### Development Tips
- Use Vue.js Composition API for new components
- Follow the existing i18n pattern for new translations
- Test with different languages and websites
- Ensure Shadow DOM compatibility

## 🚀 Performance

- **Lightweight**: ~11KB content script for minimal page impact
- **Fast Loading**: <50ms initialization on most pages
- **Efficient**: Shadow DOM prevents style recalculations
- **Optimized**: Vite's tree-shaking keeps bundle size small

## 🔒 Privacy & Security

- **Local Storage Only**: All settings stored locally on your device
- **No Tracking**: Zero analytics or user tracking
- **Secure API**: Direct communication with Google's API only
- **Minimal Permissions**: Only essential Chrome APIs used

## 📄 License

This project is for educational and personal use.

---

**Made with ❤️ using Vue.js 3, Tailwind CSS v4, and Google Gemini AI**

**Developed with modern web technologies and a focus on user experience**
