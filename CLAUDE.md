# Konnyaku Translator - Technical Documentation

## Project Overview

Konnyaku Translator is a Chrome extension that provides instant text translation using Google's Gemini API. The extension features an intuitive floating button interface that appears when users select text on any webpage, with full internationalization support and modern Vue.js architecture.

## Architecture

### Core Components

1. **Content Script** (`src/content.js`)
   - Handles text selection detection and mouse position tracking
   - Creates floating translation button with smart positioning
   - Manages translation popup with language selector
   - Implements Shadow DOM for style isolation
   - Includes i18n support for content script UI elements

2. **Background Script** (`src/background.js`)
   - Manages Google Gemini API communications
   - Handles translation requests and responses using Gemini 2.5 Flash Lite Preview
   - Opens options page when requested
   - Implements error handling and API response processing

3. **Options Page** (`options.html`, `src/options.js`, `src/components/OptionsApp.vue`)
   - Vue.js-based settings interface
   - API key configuration with password field
   - Language preferences with checkbox selection
   - UI language selector for interface localization
   - Save status feedback

4. **Popup Interface** (`popup.html`, `src/popup.js`, `src/components/PopupApp.vue`)
   - Minimal popup that redirects to options page
   - Quick access to settings from browser toolbar

### Internationalization System

1. **Content Script i18n** (`src/i18n/content-i18n.js`)
   - Standalone i18n system for content script
   - Supports 5 UI languages (en, zh-TW, zh-CN, ja, ko)
   - Browser language auto-detection

2. **Vue Component i18n** (`src/i18n/useI18n.js`)
   - Composable for Vue components
   - Shared locale definitions (`src/i18n/locales.js`)
   - Persistent language preference

### Key Features

- **Smart Button Positioning**: Floating button appears at mouse release position
- **Inline Language Selection**: Dropdown selector in translation popup
- **Real-time Translation**: Instant translation with loading states
- **Multi-language Support**: 15 translation languages, 5 UI languages
- **Settings Integration**: Quick access to options page
- **Persistent Storage**: User preferences saved locally
- **Shadow DOM Isolation**: Prevents style conflicts with host pages

## Technical Stack

- **Framework**: Vue.js 3 with Composition API
- **Build Tool**: Vite 6.0
- **Styling**: Tailwind CSS v4.0
- **Icon System**: Lucide icons
- **API**: Google Gemini 2.5 Flash Lite Preview
- **Manifest**: Chrome Extension Manifest V3
- **i18n**: Custom internationalization system

## Development

### Build System

```bash
# Install dependencies
npm install

# Development with hot reload
npm run dev

# Production build
npm run build

# Preview build
npm run preview
```

### Build Configuration

The project uses Vite with custom configuration:
- Multiple entry points for different extension parts
- Vue.js plugin for component processing
- Tailwind CSS for styling
- Custom plugin for copying manifest.json and content.css
- Optimized chunk splitting

### File Structure

```
src/
├── assets/              # Static assets
├── background.js        # Service worker for API calls
├── content.js           # Content script for webpage interaction
├── content.css          # Styles for injected UI elements
├── popup.js             # Popup initialization
├── options.js           # Settings page initialization
├── style.css            # Global styles
├── components/
│   ├── PopupApp.vue     # Popup component
│   └── OptionsApp.vue   # Settings component
└── i18n/
    ├── content-i18n.js  # i18n for content script
    ├── locales.js       # Translation strings
    └── useI18n.js       # i18n composable for Vue

public/
└── icon.png             # Extension icon

dist/                    # Built extension files
├── manifest.json        # Extension manifest
├── content.js           # Compiled content script
├── content.css          # Content styles
├── background.js        # Compiled background script
├── popup.html           # Popup interface
├── options.html         # Settings page
├── icon.png             # Extension icon
└── assets/              # CSS and JS assets
```

## API Integration

### Google Gemini API

The extension uses the Gemini 2.5 Flash Lite Preview model:

- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite-preview:generateContent`
- **Authentication**: API key-based
- **Features**: Auto-detection of source language, customizable target language
- **Model**: Optimized for fast, lightweight translations

### Translation Logic

1. User selects text and floating button appears
2. User clicks button to initiate translation
3. Content script captures selected text and target language
4. Message sent to background script with translation request
5. Background script calls Gemini API with formatted prompt
6. API response processed and sent back to content script
7. Translation displayed in popup with language selector

## User Interface

### Floating Button

- **Position**: Appears at mouse release position with offset
- **Icon**: Lucide Languages icon (16x16)
- **Behavior**: Shows on text selection, hides on click outside
- **Styling**: Blue circular button with hover effects and shadow
- **Z-index**: High value (2147483647) to ensure visibility

### Translation Popup

- **Layout**: Compact design with header and content area
- **Header**: Language selector and settings button
- **Content**: Translation display with loading states
- **Language Selector**: Dropdown with preferred languages
- **States**: Loading (spinner), success (translation), error
- **Dimensions**: Max width 400px, max height 300px

## Storage Schema

Uses Chrome's storage API:

```javascript
{
  // API Configuration
  apiKey: "user-gemini-api-key",
  
  // Language Preferences
  targetLanguage: "zh-TW",              // Default target language
  preferredLanguages: ["zh-TW", "en"],  // Selected languages
  
  // UI Settings
  uiLanguage: "en"                      // Interface language
}
```

## Performance Optimizations

- **Lazy Loading**: Components loaded on demand
- **Shadow DOM**: Isolated styling prevents conflicts
- **Event Delegation**: Efficient event handling
- **Debounced Selection**: Prevents excessive updates
- **Optimized Bundle**: Tree-shaking and minification
- **Small Content Script**: ~11KB for minimal impact

## Browser Compatibility

- Chrome 88+ (Manifest V3 support)
- Edge 88+ (Chromium-based)
- Brave, Opera, and other Chromium browsers
- Does not support Firefox (uses Chrome-specific APIs)

## Security

- **Permissions**: Minimal permissions (activeTab, storage, contextMenus)
- **CSP Compliance**: Follows Content Security Policy
- **API Key Storage**: Stored in Chrome's local storage
- **No External Dependencies**: All resources bundled
- **Shadow DOM**: Prevents CSS injection attacks
- **Input Sanitization**: Text content properly escaped

## Testing Checklist

### Functional Testing

1. **Text Selection**: 
   - Select text on various websites
   - Test with different text lengths
   - Test special characters and emojis

2. **Button Positioning**: 
   - Verify button appears at mouse position
   - Test near page edges
   - Test with scrolling

3. **Translation**: 
   - Test all 15 supported languages
   - Verify language switching
   - Test error handling

4. **Settings**: 
   - Verify API key persistence
   - Test language preference saving
   - Test UI language switching

5. **Edge Cases**: 
   - Empty selection
   - Very long text
   - Network failures
   - Invalid API key

### Browser Testing

- Test on news sites, blogs, social media
- Verify iframe compatibility
- Test with different encodings
- Check performance on heavy pages

## Common Commands

```bash
# Lint (if configured)
npm run lint

# Type check (if configured)
npm run typecheck

# Test (if configured)
npm test

# Build for production
npm run build

# Development server
npm run dev
```

## Troubleshooting

1. **Extension Not Loading**: 
   - Check manifest.json is in dist folder
   - Verify all required files are built
   - Check Chrome console for errors

2. **API Errors**: 
   - Verify API key is valid
   - Check network connectivity
   - Monitor API quota limits

3. **Button Not Appearing**: 
   - Check if site blocks content scripts
   - Verify text is actually selected
   - Check console for JavaScript errors

4. **Translation Failures**: 
   - Ensure API key has proper permissions
   - Check for rate limiting
   - Verify internet connection

5. **Style Conflicts**: 
   - Shadow DOM should prevent most issues
   - Check for !important overrides
   - Verify CSS injection

## Future Enhancements

- **Context Menu Integration**: Right-click translation option
- **Keyboard Shortcuts**: Customizable hotkeys
- **Translation History**: Recent translations storage
- **Offline Mode**: Cache frequent translations
- **Text-to-Speech**: Audio pronunciation
- **Full Page Translation**: Translate entire pages
- **Custom Dictionaries**: User-defined translations
- **Translation Confidence**: Show AI confidence scores

## Contributing Guidelines

When contributing to Konnyaku Translator:

1. **Code Style**:
   - Follow existing Vue.js patterns
   - Use Composition API for new components
   - Maintain consistent indentation

2. **Testing**:
   - Test on multiple websites
   - Verify all languages work
   - Check memory usage

3. **Documentation**:
   - Update relevant documentation
   - Add comments for complex logic
   - Update README if adding features

4. **Commits**:
   - Use clear, descriptive messages
   - Reference issues when applicable
   - Keep commits focused

5. **Compatibility**:
   - Maintain Chrome 88+ support
   - Don't break existing features
   - Consider performance impact

## Architecture Decisions

1. **Shadow DOM**: Chosen for complete style isolation
2. **Vue.js 3**: Modern framework with small bundle size
3. **Vite**: Fast development and optimized builds
4. **Gemini API**: Best balance of quality and speed
5. **Manifest V3**: Future-proof and security focused
6. **i18n System**: Custom implementation for flexibility

## Performance Metrics

- **Content Script Size**: ~11KB (minified)
- **Total Extension Size**: ~75KB
- **Load Time**: <50ms on most pages
- **Translation Speed**: 500-1500ms (API dependent)
- **Memory Usage**: <10MB active

## License

This project is for educational and personal use.