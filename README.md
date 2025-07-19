# Konnyaku Translator 🌐

<div align="center">
  <img src="src/assets/images/logo.png" alt="Konnyaku Translator Logo" width="128" height="128">

  Konnyaku Translator - 強大的 Chrome 瀏覽器擴充功能，使用 Google Gemini API 提供即時文字翻譯

  [![Chrome](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/)
  [![Vue.js](https://img.shields.io/badge/Vue.js-3-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org/)
  [![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
</div>

功能強大的 Chrome 瀏覽器擴充功能，使用 Google Gemini API 提供即時文字翻譯。在任何網頁上選取文字，即可透過精美的浮動介面獲得即時翻譯，並完整支援國際化功能。

## ✨ 功能特色

- **🎯 智慧定位**: 浮動按鈕精確出現在滑鼠游標位置
- **🌍 多語言支援**: 支援 15 種翻譯語言和 5 種介面語言
- **⚡ 即時翻譯**: 由 Google Gemini 2.5 Flash Lite 提供的即時翻譯
- **🎨 現代化介面**: 使用 Vue.js 3 和 Tailwind CSS 建構的簡潔直觀介面
- **🌐 國際化支援**: 完整支援 English、繁體中文、简体中文、日本語、한국어
- **⚙️ 簡易設定**: 簡單的 API 金鑰配置和直觀的設定頁面
- **💾 持久化設定**: 您的語言偏好和介面設定會自動儲存
- **🛡️ 樣式隔離**: Shadow DOM 防止與主網站樣式衝突

## 🚀 快速開始

### 安裝步驟

1. **建構擴充功能**
   ```bash
   bun install
   bun run build
   ```

2. **載入至 Chrome**
   - 開啟 Chrome 並前往 `chrome://extensions/`
   - 啟用「開發人員模式」
   - 點擊「載入未封裝項目」並選擇 `dist` 資料夾

3. **取得 API 金鑰**
   - 前往 [Google AI Studio](https://aistudio.google.com/app/apikey)
   - 產生新的 API 金鑰
   - 點擊擴充功能圖示 → 設定
   - 輸入您的 API 金鑰並儲存

## 🎮 使用方法

1. **選取文字** 在任何網頁上
2. **點擊浮動按鈕** 出現在游標附近的按鈕
3. **選擇目標語言** 從下拉選單中選擇
4. **獲得即時翻譯** 由 AI 提供支援

### 專業技巧
- 翻譯彈出視窗預設顯示您偏好的語言
- 使用設定按鈕 (⚙️) 來配置 API 金鑰和偏好設定
- 此擴充功能適用於任何可選取文字的網站

## 🛠️ Development

### Tech Stack
- **Vue.js 3** with Composition API
- **Vite 6.0** with @crxjs/vite-plugin for lightning-fast builds
- **Tailwind CSS v4.0** for utility-first styling
- **Google Gemini 2.5 Flash Lite Preview** for AI translation
- **Chrome Extension Manifest V3** with dynamic generation
- **Custom i18n** for internationalization with language utilities
- **Modular Architecture** for maintainability and scalability

### Build Commands
```bash
# Using Bun (recommended)
bun install           # Install dependencies
bun run dev          # Development with hot reload
bun run build        # Production build
bun run preview      # Preview build
```

### Project Structure
```
src/
├── background.js        # Background script entry point
├── background/          # Background script modules
│   ├── config-manager.js    # Configuration and settings management
│   ├── gemini-api.js        # Gemini API integration
│   └── message-handler.js   # Message routing and handling
├── content.js           # Content script entry point
├── content/             # Content script modules
│   ├── index.js             # Module initialization
│   ├── ui-manager.js        # UI state management
│   ├── ui-components.js     # UI element creation
│   ├── event-handlers.js    # Event handling logic
│   ├── translation-service.js # Translation coordination
│   └── css-loader.js        # CSS management for Shadow DOM
├── constants/           # Shared constants
│   └── index.js             # Centralized constant definitions
├── content.css          # Isolated styles for content script
├── popup.js            # Extension popup initialization
├── options.js          # Settings page initialization
├── components/
│   ├── PopupApp.vue    # Popup component (redirects to options)
│   └── OptionsApp.vue  # Full-featured settings component
└── i18n/
    ├── language-constants.js # Language utilities and constants
    ├── content-i18n.js # Content script internationalization
    ├── locales.js      # Translation strings for all languages
    └── useI18n.js      # Vue.js i18n composable
```

## 🏗️ 架構設計

### 模組化設計優勢

此擴充功能采用高度模組化的架構，提供以下優勢：

- **🔧 可維護性**: 每個模組負責單一職責
- **🧪 可測試性**: 模組可以獨立測試
- **♻️ 可重用性**: 共用功能在元件間共享
- **📁 組織性**: 相關程式碼逾輯分組
- **🐛 除錯性**: 問題可隨特定模組隔離
- **👥 協作性**: 多人可同時開發不同模組
- **📈 可擴展性**: 易於新增功能而不影響現有程式碼

### 模組概觀

- **背景模組**: API 整合、配置管理和訊息路由
- **內容模組**: UI 管理、事件處理和翻譯協調
- **常數模組**: 集中式定義確保一致性
- **i18n 模組**: 全面的語言支援和工具

## 🌐 支援語言

### 翻譯語言
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

### 介面語言
- 🇺🇸 English
- 🇹🇼 繁體中文 (Traditional Chinese)
- 🇨🇳 简体中文 (Simplified Chinese)
- 🇯🇵 日本語 (Japanese)
- 🇰🇷 한국어 (Korean)

## 📋 系統需求

- Chrome 88+ 或任何基於 Chromium 的瀏覽器
- Google Gemini API 金鑰（提供免費版本）
- 網路連線以進行翻譯

## 🔧 配置設定

### API 設定
1. 從 [Google AI Studio](https://aistudio.google.com/app/apikey) 獲取免費 API 金鑰
2. 點擊瀏覽器工具列中的擴充功能圖示
3. 您將被重定向至設定頁面
4. 在安全密碼欄位中輸入您的 API 金鑰
5. 從核取方塊清單中選擇您偏好的語言
6. 為介面選擇您的 UI 語言
7. 點擊儲存並開始翻譯！

### 權限設定
此擴充功能僅需最少權限：
- `activeTab`: 存取當前網頁內容
- `storage`: 本地儲存您的偏好設定
- `contextMenus`: 未來右鍵選單支援
- Google API 端點的主機權限

## 🐛 問題排解

### 常見問題

**擴充功能無法載入？**
- 確保您先執行了 `bun run build`
- 檢查 `dist` 資料夾中是否存在所有檔案
- 在 Chrome 擴充功能頁面中查找錯誤訊息

**翻譯無法運作？**
- 驗證您的 API 金鑰在設定中是否正確輸入
- 檢查您的網路連線
- 確保您沒有超過 API 速率限制
- 嘗試選擇不同的目標語言

**按鈕未出現？**
- 某些網站會阻止內容腳本（例如 Chrome Web Store）
- 嘗試用滑鼠選取文字（不要用鍵盤）
- 檢查 Shadow DOM 是否正確初始化
- 重新整理頁面並再試一次

**介面語言錯誤？**
- 前往設定並選擇您偏好的 UI 語言
- 擴充功能在第一次安裝時會自動檢測瀏覽器語言

## 📖 文件資料

有關詳細技術文件、架構細節和貢獻指南，請參閱 [CLAUDE.md](./CLAUDE.md)。

## 🤝 貢獻指南

歡迎您的貢獻！請遵循以下步驟：
1. Fork 此儲存庫
2. 建立功能分支 (`git checkout -b feature/amazing-feature`)
3. 按照我們的程式碼風格進行修改
4. 在多個網站上徹底測試
5. 使用清晰的訊息提交 (`git commit -m 'Add amazing feature'`)
6. 推送至您的分支 (`git push origin feature/amazing-feature`)
7. 提交 pull request

### 開發技巧
- **遵循模組化模式**: 每個模組應該有單一、清晰的職責
- **使用 Vue.js Composition API** 來開發新元件
- **善用共享常數** 從 `src/constants/` 中獲取以確保一致性
- **遵循現有的 i18n 模式** 使用 `src/i18n/language-constants.js`
- **使用不同語言和網站進行測試** 以確保相容性
- **確保 Shadow DOM 相容性** 在修改 UI 元件時
- **保持模組專注**: 避免在單一模組中混合關注點
- **記錄模組介面**: 清晰定義匯出和其目的

## 🚀 效能表現

- **輕量級**: 約 11KB 內容腳本，對頁面影響最小
- **快速載入**: 在大多數頁面上 <50ms 初始化
- **高效能**: Shadow DOM 防止樣式重新計算
- **優化的**: Vite 的 tree-shaking 保持打包大小較小

## 🔒 隱私與安全

- **僅本地儲存**: 所有設定都儲存在您的裝置上
- **無追蹤**: 零分析或使用者追蹤
- **安全 API**: 僅與 Google API 直接通信
- **最少權限**: 僅使用必要的 Chrome API

## 📄 授權條款

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案

---

**使用 Vue.js 3、Tailwind CSS v4 和 Google Gemini AI 以 ❤️ 製作**

**使用現代網路技術開發，專注於使用者體驗**
