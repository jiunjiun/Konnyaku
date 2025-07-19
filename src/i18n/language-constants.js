/**
 * 語言相關常數定義
 * 集中管理所有語言代碼、名稱和相關設定
 * 
 * @module i18n/language-constants
 */

/**
 * 支援的語言代碼與英文名稱對應
 * 使用 ISO 639-1 標準的語言代碼（部分使用擴展如 zh-TW）
 * 
 * @constant {Object.<string, string>}
 * @example
 * // 獲取語言的英文名稱
 * const englishName = LANGUAGE_NAMES_EN['zh-TW'] // 'Traditional Chinese'
 */
export const LANGUAGE_NAMES_EN = {
  'zh-TW': 'Traditional Chinese',
  'zh-CN': 'Simplified Chinese',
  'ja': 'Japanese',
  'ko': 'Korean',
  'en': 'English',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'ar': 'Arabic',
  'hi': 'Hindi',
  'th': 'Thai',
  'vi': 'Vietnamese'
}

/**
 * 語言的原生名稱（用於顯示在語言選擇器中）
 * 
 * @constant {Object.<string, string>}
 * @example
 * // 獲取語言的原生名稱
 * const nativeName = LANGUAGE_NATIVE_NAMES['ja'] // '日本語'
 */
export const LANGUAGE_NATIVE_NAMES = {
  'zh-TW': '繁體中文',
  'zh-CN': '简体中文',
  'ja': '日本語',
  'ko': '한국어',
  'en': 'English',
  'es': 'Español',
  'fr': 'Français',
  'de': 'Deutsch',
  'it': 'Italiano',
  'pt': 'Português',
  'ru': 'Русский',
  'ar': 'العربية',
  'hi': 'हिन्दी',
  'th': 'ไทย',
  'vi': 'Tiếng Việt'
}

/**
 * 各種語言中的語言名稱翻譯
 * 用於在不同的 UI 語言下顯示語言名稱
 * 
 * @constant {Object.<string, Object.<string, string>>}
 * @example
 * // 獲取在繁體中文介面下的日文名稱
 * const japaneseName = LANGUAGE_TRANSLATIONS['zh-TW']['ja'] // '日文'
 */
export const LANGUAGE_TRANSLATIONS = {
  'en': {
    'zh-TW': 'Traditional Chinese',
    'zh-CN': 'Simplified Chinese',
    'ja': 'Japanese',
    'ko': 'Korean',
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'ru': 'Russian',
    'ar': 'Arabic',
    'hi': 'Hindi',
    'th': 'Thai',
    'vi': 'Vietnamese'
  },
  'zh-TW': {
    'zh-TW': '繁體中文',
    'zh-CN': '簡體中文',
    'ja': '日文',
    'ko': '韓文',
    'en': '英文',
    'es': '西班牙文',
    'fr': '法文',
    'de': '德文',
    'it': '義大利文',
    'pt': '葡萄牙文',
    'ru': '俄文',
    'ar': '阿拉伯文',
    'hi': '印地文',
    'th': '泰文',
    'vi': '越南文'
  },
  'zh-CN': {
    'zh-TW': '繁体中文',
    'zh-CN': '简体中文',
    'ja': '日文',
    'ko': '韩文',
    'en': '英文',
    'es': '西班牙文',
    'fr': '法文',
    'de': '德文',
    'it': '意大利文',
    'pt': '葡萄牙文',
    'ru': '俄文',
    'ar': '阿拉伯文',
    'hi': '印地文',
    'th': '泰文',
    'vi': '越南文'
  },
  'ja': {
    'zh-TW': '繁体字中国語',
    'zh-CN': '簡体字中国語',
    'ja': '日本語',
    'ko': '韓国語',
    'en': '英語',
    'es': 'スペイン語',
    'fr': 'フランス語',
    'de': 'ドイツ語',
    'it': 'イタリア語',
    'pt': 'ポルトガル語',
    'ru': 'ロシア語',
    'ar': 'アラビア語',
    'hi': 'ヒンディー語',
    'th': 'タイ語',
    'vi': 'ベトナム語'
  },
  'ko': {
    'zh-TW': '번체 중국어',
    'zh-CN': '간체 중국어',
    'ja': '일본어',
    'ko': '한국어',
    'en': '영어',
    'es': '스페인어',
    'fr': '프랑스어',
    'de': '독일어',
    'it': '이탈리아어',
    'pt': '포르투갈어',
    'ru': '러시아어',
    'ar': '아랍어',
    'hi': '힌디어',
    'th': '태국어',
    'vi': '베트남어'
  }
}

/**
 * 支援的 UI 語言列表
 * 這些語言有完整的介面翻譯
 * 
 * @constant {string[]}
 */
export const SUPPORTED_UI_LANGUAGES = ['en', 'zh-TW', 'zh-CN', 'ja', 'ko']

/**
 * 支援的翻譯目標語言列表
 * 所有可用的翻譯語言代碼
 * 
 * @constant {string[]}
 */
export const SUPPORTED_TRANSLATION_LANGUAGES = Object.keys(LANGUAGE_NAMES_EN)

/**
 * 預設語言設定
 * 
 * @constant {Object}
 */
export const DEFAULT_LANGUAGE_SETTINGS = {
  UI_LANGUAGE: 'en',
  TARGET_LANGUAGE: 'zh-TW'
}

/**
 * 獲取指定 UI 語言下的語言名稱
 * 
 * @param {string} uiLanguage - UI 語言代碼
 * @param {string} targetLanguage - 目標語言代碼
 * @param {boolean} includeNativeName - 是否包含原生名稱
 * @returns {string} 語言名稱
 * @example
 * // 獲取繁體中文介面下的日文名稱
 * getLanguageName('zh-TW', 'ja') // '日文'
 * 
 * // 包含原生名稱
 * getLanguageName('zh-TW', 'ja', true) // '日文(日本語)'
 */
export function getLanguageName(uiLanguage, targetLanguage, includeNativeName = false) {
  const translations = LANGUAGE_TRANSLATIONS[uiLanguage] || LANGUAGE_TRANSLATIONS.en
  const translatedName = translations[targetLanguage] || LANGUAGE_NAMES_EN[targetLanguage] || targetLanguage
  
  if (includeNativeName && LANGUAGE_NATIVE_NAMES[targetLanguage]) {
    return `${translatedName}(${LANGUAGE_NATIVE_NAMES[targetLanguage]})`
  }
  
  return translatedName
}

/**
 * 獲取用於顯示的語言列表
 * 
 * @param {string} uiLanguage - UI 語言代碼
 * @param {boolean} includeNativeName - 是否包含原生名稱
 * @returns {Array<{code: string, name: string}>} 語言列表
 * @example
 * // 獲取英文介面的語言列表
 * getLanguageList('en')
 * // [
 * //   { code: 'zh-TW', name: 'Traditional Chinese' },
 * //   { code: 'ja', name: 'Japanese' },
 * //   ...
 * // ]
 */
export function getLanguageList(uiLanguage, includeNativeName = false) {
  return SUPPORTED_TRANSLATION_LANGUAGES.map(code => ({
    code,
    name: getLanguageName(uiLanguage, code, includeNativeName)
  }))
}

/**
 * 檢測用戶的語言偏好
 * 優先順序：儲存的設定 > 瀏覽器語言 > 預設語言
 * 
 * @param {string} browserLanguage - 瀏覽器語言（如 'zh-TW', 'en-US'）
 * @param {string} savedLanguage - 儲存的語言設定
 * @returns {string} 檢測到的語言代碼
 * @example
 * // 瀏覽器語言為繁體中文
 * detectUserLanguage('zh-TW') // 'zh-TW'
 * 
 * // 瀏覽器語言為英文但有儲存的設定
 * detectUserLanguage('en-US', 'ja') // 'ja'
 * 
 * // 不支援的語言會回傳預設值
 * detectUserLanguage('pt-BR') // 'en'
 */
export function detectUserLanguage(browserLanguage, savedLanguage = null) {
  // 優先使用儲存的設定
  if (savedLanguage && SUPPORTED_UI_LANGUAGES.includes(savedLanguage)) {
    return savedLanguage
  }
  
  // 檢查瀏覽器語言
  if (browserLanguage) {
    // 完全匹配
    if (SUPPORTED_UI_LANGUAGES.includes(browserLanguage)) {
      return browserLanguage
    }
    
    // 只取語言代碼部分（如 'en-US' -> 'en'）
    const languageCode = browserLanguage.split('-')[0]
    if (SUPPORTED_UI_LANGUAGES.includes(languageCode)) {
      return languageCode
    }
    
    // 特殊處理中文變體
    if (browserLanguage.startsWith('zh')) {
      // 根據地區碼判斷繁簡體
      if (browserLanguage.includes('TW') || browserLanguage.includes('HK')) {
        return 'zh-TW'
      }
      return 'zh-CN'
    }
  }
  
  // 預設語言
  return DEFAULT_LANGUAGE_SETTINGS.UI_LANGUAGE
}