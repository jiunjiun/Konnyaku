/**
 * 應用程式共用常數定義
 */

/**
 * API 相關常數
 */
export const API = {
  BASE_URL: 'https://generativelanguage.googleapis.com/v1beta',
  MODEL_NAME: 'gemini-2.5-flash-lite-preview-06-17',
  DEFAULT_TARGET_LANGUAGE: 'zh-TW'
}

/**
 * 語言代碼與名稱對應表
 * 從 i18n 模組匯入以保持一致性
 */
export { LANGUAGE_NAMES_EN as LANGUAGE_MAP } from '../i18n/language-constants.js'

/**
 * 所有支援的語言列表
 * 從 i18n 模組匯入以保持一致性
 */
export { SUPPORTED_TRANSLATION_LANGUAGES as SUPPORTED_LANGUAGES } from '../i18n/language-constants.js'

/**
 * DOM 相關常數
 */
export const DOM = {
  FLOATING_BUTTON_ID: 'konnyaku-floating-container',
  TRANSLATION_POPUP_ID: 'konnyaku-translation-container',
  FLOATING_BUTTON_CLASS: 'konnyaku-floating-container',
  TRANSLATION_POPUP_CLASS: 'konnyaku-translation-container',
  FLOATING_BUTTON_CSS_SELECTOR: '.konnyaku-floating-button-shadow-css',
  TRANSLATION_POPUP_CSS_SELECTOR: '.konnyaku-translation-popup-shadow-css'
}

/**
 * 浮動按鈕的位置偏移量
 */
export const FLOATING_BUTTON_OFFSET = {
  X: 18,
  Y: 44 // 36 + 8
}

/**
 * 翻譯彈出視窗的位置偏移量
 */
export const TRANSLATION_POPUP_OFFSET = {
  X: 0,
  Y: 10
}

/**
 * 事件延遲時間（毫秒）
 */
export const EVENT_DELAYS = {
  SELECTION_CHECK: 10
}

/**
 * Chrome Runtime 訊息動作類型
 */
export const MESSAGE_ACTIONS = {
  TRANSLATE: 'translate',
  OPEN_OPTIONS_PAGE: 'openOptionsPage',
  GET_SELECTED_TEXT: 'getSelectedText'
}

/**
 * 儲存鍵值名稱
 */
export const STORAGE_KEYS = {
  API_KEY: 'apiKey',
  TARGET_LANGUAGE: 'targetLanguage',
  PREFERRED_LANGUAGES: 'preferredLanguages',
  UI_LANGUAGE: 'uiLanguage'
}

// 匯出語言相關常數
/**
 * 匯出語言相關常數
 * 使用 i18n 模組中的定義以避免重複
 */
export { 
  LANGUAGE_TRANSLATIONS,
  LANGUAGE_NATIVE_NAMES,
  SUPPORTED_UI_LANGUAGES,
  DEFAULT_LANGUAGE_SETTINGS,
  getLanguageName,
  getLanguageList,
  detectUserLanguage
} from '../i18n/language-constants.js'