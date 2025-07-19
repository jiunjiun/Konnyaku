# Konnyaku Translator - Technical Documentation

This document serves as the authoritative development guide for the Konnyaku Translator Chrome Extension project. It defines our development principles, methodologies, and standards to ensure consistent, high-quality code.

## Project Overview

Konnyaku Translator is a Chrome extension that provides instant text translation using Google's Gemini API. The extension features an intuitive floating button interface that appears when users select text on any webpage, with full internationalization support, modern Vue.js architecture, and a highly modular codebase designed for maintainability and extensibility.

## Core Development Principles

### 1. Component-First Development
- **Small, focused components**: Each Vue component should have a single, clear responsibility
- **Composition over inheritance**: Use Vue Composition API and composables for code reuse
- **Declarative over imperative**: Leverage Vue's reactivity system instead of manual DOM manipulation

### 2. Type Safety and Data Validation
- **Validate at boundaries**: All data from external sources (Gemini API, Chrome APIs) must be validated
- **Parse, don't validate**: Transform raw data into domain objects with guaranteed properties
- **Fail fast**: Surface errors immediately rather than propagating invalid states

### 3. Modular Architecture
- **Single responsibility modules**: Each module handles one specific aspect of functionality
- **Clear interfaces**: Well-defined exports and imports between modules
- **Dependency injection**: Pass dependencies explicitly rather than using global state
- **Testability**: Modules should be independently testable

### 4. Chrome Extension Best Practices
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
   bun run build  # Always verify builds after changes
   ```

### Code Organization Standards

#### Background Scripts (`src/background/`)
- **Modular services**: Split into focused modules (config-manager, gemini-api, message-handler)
- **Single responsibility**: Each module handles one aspect of background functionality
- **Stateless operations**: Services should not maintain internal state
- **Error transformation**: Convert API errors to user-friendly messages
- **Module structure**:
  - `config-manager.js`: Manages all configuration and settings
  - `gemini-api.js`: Handles Gemini API communication and translation
  - `message-handler.js`: Routes messages between content and background scripts

#### Content Scripts (`src/content/`)
- **Modular architecture**: Split into focused modules for better maintainability
- **Security first**: Always validate origins and message sources
- **Graceful degradation**: Handle errors without breaking the page
- **Module structure**:
  - `index.js`: Entry point that initializes the content script
  - `ui-manager.js`: Manages UI state and coordinates components
  - `ui-components.js`: Creates and manages UI elements (button, popup)
  - `event-handlers.js`: Handles all DOM events and user interactions
  - `translation-service.js`: Manages translation requests and language settings
  - `css-loader.js`: Loads and processes CSS for Shadow DOM

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

### Benefits of Modular Architecture

The modular approach provides several key advantages:

- **Maintainability**: Each module has a clear, single responsibility making it easier to understand and modify
- **Testability**: Modules can be tested independently with mock dependencies
- **Reusability**: Common functionality can be shared across different parts of the extension
- **Code Organization**: Related functionality is grouped together, making the codebase easier to navigate
- **Debugging**: Issues can be isolated to specific modules, simplifying troubleshooting
- **Team Collaboration**: Different developers can work on different modules with minimal conflicts
- **Scalability**: New features can be added as new modules without affecting existing code

### Modular Architecture Overview

The codebase is organized into highly modular components, each with specific responsibilities:

```
├── src/background/          # Background script modules
│   ├── config-manager.js    # Configuration and settings management
│   ├── gemini-api.js        # Gemini API integration
│   └── message-handler.js   # Message routing and handling
├── src/content/             # Content script modules
│   ├── index.js             # Entry point and initialization
│   ├── ui-manager.js        # UI state management
│   ├── ui-components.js     # UI element creation
│   ├── event-handlers.js    # Event handling logic
│   ├── translation-service.js # Translation coordination
│   └── css-loader.js        # Shadow DOM CSS handling
├── src/constants/           # Shared constants
│   └── index.js             # Centralized constant definitions
└── src/i18n/                # Internationalization
    ├── language-constants.js # Language-related constants
    ├── content-i18n.js      # Content script i18n
    ├── locales.js           # Translation strings
    └── useI18n.js           # Vue i18n composable
```

### Core Components

1. **Content Script Modules** (`src/content/`)
   - **index.js**: Initializes UI manager and event listeners
   - **ui-manager.js**: Manages floating button and popup state
   - **ui-components.js**: Creates Shadow DOM components
   - **event-handlers.js**: Handles mouse events and text selection
   - **translation-service.js**: Coordinates with background script
   - **css-loader.js**: Manages CSS for Shadow DOM isolation

2. **Background Script Modules** (`src/background/`)
   - **config-manager.js**: Handles all settings and storage operations
   - **gemini-api.js**: Manages Gemini API calls and responses
   - **message-handler.js**: Routes messages between components

3. **Options Page** (`options.html`, `src/options.js`, `src/components/OptionsApp.vue`)
   - Vue.js-based settings interface
   - API key configuration with password field
   - Language preferences with checkbox selection
   - UI language selector for interface localization
   - Save status feedback

4. **Popup Interface** (`popup.html`, `src/popup.js`, `src/components/PopupApp.vue`)
   - Minimal popup that redirects to options page
   - Quick access to settings from browser toolbar

5. **Constants Module** (`src/constants/index.js`)
   - Centralized constant definitions
   - API endpoints and model names
   - DOM element IDs and classes
   - Message action types
   - Storage key names
   - Re-exports language constants from i18n module

### Internationalization System

1. **Language Constants** (`src/i18n/language-constants.js`)
   - Comprehensive language support utilities
   - Language name mappings in multiple languages
   - Helper functions for language detection and display
   - Supports 15 translation languages and 5 UI languages

2. **Content Script i18n** (`src/i18n/content-i18n.js`)
   - Standalone i18n system for content script
   - Supports 5 UI languages (en, zh-TW, zh-CN, ja, ko)
   - Browser language auto-detection

3. **Vue Component i18n** (`src/i18n/useI18n.js`)
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
- **Build Tool**: Vite 6.0 with @crxjs/vite-plugin
- **Styling**: Tailwind CSS v4.0
- **Icon System**: Lucide icons
- **API**: Google Gemini 2.5 Flash Lite Preview
- **Manifest**: Chrome Extension Manifest V3 (dynamic generation)
- **i18n**: Custom internationalization system with language utilities
- **Package Manager**: Bun (recommended) or npm

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

The project uses Vite with @crxjs/vite-plugin for seamless Chrome extension development:
- **@crxjs/vite-plugin**: Handles manifest generation and Chrome extension specifics
- **Dynamic manifest**: Generated from `manifest.config.mjs` using package.json values
- **Multiple entry points**: Automatically configured for extension parts
- **Vue.js plugin**: For component processing with hot module replacement
- **Tailwind CSS v4**: Integrated with @tailwindcss/vite
- **Path aliases**: Configured in `config/vite/resolve_alias.js` for cleaner imports
- **Optimized output**: Extension-friendly bundle structure

### File Structure

```
src/
├── assets/              # Static assets
├── background.js        # Background script entry point
├── background/          # Background script modules
│   ├── config-manager.js    # Configuration management
│   ├── gemini-api.js        # Gemini API integration
│   └── message-handler.js   # Message routing
├── content.js           # Content script entry point
├── content/             # Content script modules
│   ├── index.js             # Module initialization
│   ├── ui-manager.js        # UI state management
│   ├── ui-components.js     # UI element creation
│   ├── event-handlers.js    # Event handling
│   ├── translation-service.js # Translation coordination
│   └── css-loader.js        # CSS management
├── constants/           # Shared constants
│   └── index.js             # Centralized constants
├── content.css          # Styles for injected UI elements
├── popup.js             # Popup initialization
├── options.js           # Settings page initialization
├── style.css            # Global styles
├── components/
│   ├── PopupApp.vue     # Popup component
│   └── OptionsApp.vue   # Settings component
└── i18n/
    ├── language-constants.js # Language utilities
    ├── content-i18n.js  # i18n for content script
    ├── locales.js       # Translation strings
    └── useI18n.js       # i18n composable for Vue

config/
└── vite/
    └── resolve_alias.js # Path aliases for imports

manifest.config.mjs      # Dynamic manifest generation
vite.config.mjs          # Vite configuration
package.json             # Dependencies and scripts

public/
└── icon.png             # Extension icon

dist/                    # Built extension files
├── manifest.json        # Generated extension manifest
├── src/
│   ├── content.js       # Compiled content script
│   ├── content.css      # Content styles
│   └── background.js    # Compiled background script
├── popup.html           # Popup interface
├── options.html         # Settings page
├── icon.png             # Extension icon
└── assets/              # CSS and JS assets
```

## API Integration

### Google Gemini API

The extension uses the Gemini 2.5 Flash Lite Preview model:

- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite-preview-06-17:generateContent`
- **Authentication**: API key-based with format validation
- **Features**: Auto-detection of source language, customizable target language
- **Model**: Optimized for fast, lightweight translations
- **Error Handling**: User-friendly error messages in multiple languages

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
- **API Key Storage**: Stored in Chrome's local storage with format validation
- **No External Dependencies**: All resources bundled
- **Shadow DOM**: Prevents CSS injection attacks
- **Input Sanitization**: Text content properly escaped
- **Message Validation**: All Chrome runtime messages validated
- **Error Messages**: User-friendly error messages in multiple languages

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
# Using Bun (recommended)
bun install        # Install dependencies
bun run dev       # Start dev server with hot reload
bun run build     # Build for production
bun run preview   # Preview production build

# Using npm
npm install        # Install dependencies
npm run dev       # Start dev server with hot reload
npm run build     # Build for production
npm run preview   # Preview production build

# Future commands (when configured)
bun run lint      # Run linter
bun run typecheck # Run type checking
bun test          # Run tests
```

### Key Files
- `manifest.config.mjs` - Dynamic manifest configuration
- `vite.config.mjs` - Build configuration with @crxjs/vite-plugin
- `CLAUDE.md` - This development guide
- `package.json` - Dependencies and scripts
- `src/constants/index.js` - Central constant definitions
- `src/i18n/language-constants.js` - Language support utilities

### Common Tasks

#### Adding a New Translation Language
1. Add language code and names to `src/i18n/language-constants.js`:
   - Update `LANGUAGE_NAMES_EN` with English name
   - Update `LANGUAGE_NATIVE_NAMES` with native name
   - Update `LANGUAGE_TRANSLATIONS` for each UI language
2. Update locale files in `src/i18n/locales.js`
3. Update `src/content/translation-service.js` if needed
4. Test translation quality with Gemini API
5. Update documentation
6. Verify with `bun run build`

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

- **Always build before committing**: `bun run build`
- **Follow modular architecture patterns**
- **Keep modules focused and single-purpose**
- **Follow Vue 3 Composition API patterns**
- **Maintain Shadow DOM isolation**
- **Validate all external data**
- **Handle API errors gracefully with localized messages**
- **Keep content scripts lightweight and modular**
- **Document complex logic and module interfaces**
- **Test on multiple websites**
- **Verify i18n for all languages**
- **Check memory usage regularly**
- **Use constants from `src/constants/` for consistency**

Remember: This extension handles user-selected text and API keys. Security, performance, and user experience are our top priorities.
