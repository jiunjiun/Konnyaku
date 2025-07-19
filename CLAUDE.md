# Konnyaku Translator - Technical Documentation

This document serves as the authoritative development guide for the Konnyaku Translator Chrome Extension project. It defines our development principles, methodologies, and standards to ensure consistent, high-quality code.

## Project Overview

Konnyaku Translator is a Chrome extension that provides instant text translation using Google's Gemini API. The extension features an intuitive floating button interface that appears when users select text on any webpage, with full internationalization support and modern Vue.js architecture.

## Core Development Principles

### 1. Component-First Development
- **Small, focused components**: Each Vue component should have a single, clear responsibility
- **Composition over inheritance**: Use Vue Composition API and composables for code reuse
- **Declarative over imperative**: Leverage Vue's reactivity system instead of manual DOM manipulation

### 2. Type Safety and Data Validation
- **Validate at boundaries**: All data from external sources (Gemini API, Chrome APIs) must be validated
- **Parse, don't validate**: Transform raw data into domain objects with guaranteed properties
- **Fail fast**: Surface errors immediately rather than propagating invalid states

### 3. Chrome Extension Best Practices
- **Minimal permissions**: Only request permissions that are absolutely necessary
- **Secure communication**: Always validate message sources and sanitize data
- **Performance first**: Optimize for minimal memory usage and fast startup

## Development Methodology

### Feature Development Workflow

1. **Understand the requirement**
   - Review the user story or feature request
   - Identify affected components and services
   - Plan the data flow from source to UI

2. **Design the data structure**
   - Define TypeScript interfaces (even in .js files as JSDoc)
   - Create sample data for testing
   - Document the expected data format

3. **Implement incrementally**
   - Start with the data layer (background script)
   - Build the UI components
   - Connect them with proper messaging
   - Add error handling last

4. **Verify at each step**
   ```bash
   npm run build  # Always verify builds after changes
   ```

### Code Organization Standards

#### Background Scripts (`/background`)
- **Single responsibility**: Handle API calls and message routing
- **Stateless operations**: Services should not maintain internal state
- **Error transformation**: Convert API errors to user-friendly messages
- **Example structure**:
  ```javascript
  async function translateText(text, targetLanguage) {
    try {
      // Validate inputs
      // Call Gemini API
      // Transform response
      return { success: true, translation: result }
    } catch (error) {
      // Log for debugging
      // Return user-friendly error
      return { success: false, error: userMessage }
    }
  }
  ```

#### Content Scripts (`/content`)
- **Separation of concerns**: Each module has a specific responsibility
- **Security first**: Always validate origins and message sources
- **Graceful degradation**: Handle errors without breaking the page
- **Modular architecture**:
  - UI components handle rendering
  - Event handlers manage user interactions
  - Message handlers coordinate with background script

#### Components (`/components`)
- **Props validation**: Always define prop types and requirements
- **Emit documentation**: Document all emitted events with their payloads
- **Composition pattern**:
  ```vue
  <script setup>
  // 1. Imports
  // 2. Props/Emits definitions  
  // 3. Reactive state
  // 4. Computed properties
  // 5. Methods
  // 6. Lifecycle hooks
  // 7. Watchers
  </script>
  ```

### Commit Discipline

Follow conventional commits strictly:
- `feat`: New feature implementation
- `fix`: Bug fixes
- `refactor`: Code restructuring without behavior change
- `docs`: Documentation updates
- `style`: Code formatting
- `test`: Test additions or modifications
- `chore`: Build process or tool changes
- `release`: Version releases and tags

### Code Quality Standards

#### Style Rules
- 2-space indentation
- Single quotes for strings
- No trailing commas in objects
- Line width: 120 characters
- Consistent naming conventions

#### Vue-Specific Rules
- Use `<script setup>` syntax for all components
- Prefer `v-show` over `v-if` for frequently toggled elements
- Use scoped styles to prevent conflicts

#### Chrome Extension Rules
- Always check for `chrome` API availability before use
- Handle extension context invalidation gracefully
- Use Chrome Storage API for all persistence (never localStorage)
- Validate all message sources in content scripts

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

## Architecture Guidelines

### Data Flow Architecture

```
User Selection → Content Script → Background Script → Gemini API
                      ↓                    ↓              ↓
              Floating Button      Message Router    Translation
                      ↓                    ↓              ↓
            Translation Popup ← Chrome Runtime ← API Response
```

### State Management Strategy
- **Local state first**: Use component state for UI-specific data
- **Message passing**: Communicate between content and background scripts
- **Persistent state**: Use Chrome Storage for user preferences and API keys

### Error Handling Strategy

1. **Background script**: Catch and log API errors, return user-friendly messages
2. **Content script**: Display errors in UI, provide retry mechanisms
3. **Global handler**: Catch unhandled errors and log to console (development only)

## Security Guidelines

### API Key Management
- Never store API keys in code
- Use Chrome Storage API with proper encryption
- Validate API key format before use
- Clear keys on extension uninstall

### Data Handling
- Sanitize all text before translation
- Never execute dynamic code from API responses
- Validate message origins in content scripts
- Use Content Security Policy in manifest

### Content Script Security
- Always validate message origins
- Use structured message types
- Never trust data from the page
- Sanitize DOM content before use

### Permission Management
- Document why each permission is needed
- Request minimal permissions
- Provide graceful degradation if permissions are denied

## Testing Strategy

### Manual Testing Checklist
- [ ] Extension loads without errors
- [ ] Text selection triggers floating button
- [ ] Translation popup appears correctly
- [ ] Language switching works properly
- [ ] API errors display user-friendly messages
- [ ] Settings persist across sessions
- [ ] UI language changes take effect
- [ ] All 15 translation languages work
- [ ] Shadow DOM prevents style conflicts

### Build Verification
Always run before committing:
```bash
npm run build
```

### Content Script Testing
1. Test on various websites (news, blogs, social media)
2. Verify button positioning near edges
3. Test with different text lengths and special characters
4. Check that page functionality isn't broken

## Performance Guidelines

### Startup Performance
- Lazy load translation popup
- Minimize initial bundle size
- Use dynamic imports for i18n resources

### Runtime Performance  
- Debounce text selection events
- Cache recent translations appropriately
- Clean up event listeners on removal
- Optimize Shadow DOM usage

### Memory Management
- Clear translation cache periodically
- Remove event listeners when not needed
- Monitor Chrome DevTools memory profiler
- Clean up content script resources on page unload

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

## Release Workflow

### Version Management
1. Update version in `package.json` and `manifest.json`
2. Update CHANGELOG.md with release notes
3. Commit with message: `chore: release vX.X.X`
4. Create and push tag: `git tag vX.X.X && git push origin vX.X.X`
5. GitHub Actions will automatically build and create release

### GitHub Actions
The `.github/workflows/release.yml` workflow:
- Triggers on version tags (`v*`)
- Builds the extension
- Creates a zip file
- Publishes as GitHub release
- Uploads to Chrome Web Store (if configured)

## Quick Reference

### Essential Commands
```bash
npm install        # Install dependencies
npm run dev       # Start dev server with hot reload
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run linter (if configured)
npm run typecheck # Run type checking (if configured)
npm test          # Run tests (if configured)
```

### Key Files
- `manifest.json` - Extension configuration
- `vite.config.js` - Build configuration  
- `CLAUDE.md` - This development guide
- `package.json` - Dependencies and scripts

### Common Tasks

#### Adding a New Translation Language
1. Add language code to `LANGUAGES` in constants
2. Update locale files in `/src/i18n/locales.js`
3. Test translation quality with Gemini API
4. Update documentation
5. Verify with `npm run build`

#### Debugging Issues
1. Check Chrome DevTools console (both extension and page)
2. Verify API requests in Network tab
3. Inspect Chrome Storage in Application tab
4. Review background script logs
5. Check Shadow DOM in Elements tab

#### Updating Dependencies
1. Update version in package.json
2. Run `npm install`
3. Test all features thoroughly
4. Update CLAUDE.md if APIs changed

## Important Reminders

- **Always build before committing**: `npm run build`
- **Follow Vue 3 Composition API patterns**
- **Maintain Shadow DOM isolation**
- **Validate all external data**
- **Handle API errors gracefully**
- **Keep content scripts lightweight**
- **Document complex logic**
- **Test on multiple websites**
- **Verify i18n for all languages**
- **Check memory usage regularly**

Remember: This extension handles user-selected text and API keys. Security, performance, and user experience are our top priorities.