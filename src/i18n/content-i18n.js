/**
 * Content Script 專用的國際化模組
 * 提供多語言支援功能，使用統一的翻譯系統
 * 
 * 為什麼需要獨立的 content-i18n？
 * 1. Content Script 在隔離的環境中執行，無法直接使用 Vue 的響應式系統
 * 2. 需要更輕量的實作，避免載入不必要的依賴
 * 3. Chrome 擴充功能的架構限制
 * 
 * @module i18n/content-i18n
 */

import { createTranslator } from './translator.js'
import { LANGUAGE_TRANSLATIONS, detectUserLanguage } from './language-constants.js'

/**
 * Content Script 的語言資源定義
 * 只包含 content script 需要的翻譯文字
 * 
 * @constant {Object.<string, Object>}
 */
const contentLocales = {
  en: {
    translating: 'Translating...',
    error: 'Error:',
    failedToTranslate: 'Failed to translate text',
    playAudio: 'Play audio',
    audioGenerationFailed: 'Failed to generate audio',
    audioPlaybackFailed: 'Failed to play audio'
  },
  'zh-TW': {
    translating: '翻譯中...',
    error: '錯誤：',
    failedToTranslate: '翻譯失敗',
    playAudio: '播放音訊',
    audioGenerationFailed: '音訊生成失敗',
    audioPlaybackFailed: '音訊播放失敗'
  },
  'zh-CN': {
    translating: '翻译中...',
    error: '错误：',
    failedToTranslate: '翻译失败',
    playAudio: '播放音频',
    audioGenerationFailed: '音频生成失败',
    audioPlaybackFailed: '音频播放失败'
  },
  ja: {
    translating: '翻訳中...',
    error: 'エラー：',
    failedToTranslate: '翻訳に失敗しました',
    playAudio: '音声を再生',
    audioGenerationFailed: '音声生成に失敗しました',
    audioPlaybackFailed: '音声再生に失敗しました'
  },
  ko: {
    translating: '번역 중...',
    error: '오류:',
    failedToTranslate: '번역 실패',
    playAudio: '오디오 재생',
    audioGenerationFailed: '오디오 생성 실패',
    audioPlaybackFailed: '오디오 재생 실패'
  }
}

/**
 * 將語言名稱翻譯合併到 content locales 中
 * 動態添加 languages 屬性，避免重複定義
 * 
 * @private
 */
function mergeLanguageTranslations() {
  const supportedUiLanguages = Object.keys(contentLocales)
  
  supportedUiLanguages.forEach(uiLang => {
    // 如果 LANGUAGE_TRANSLATIONS 中有對應的翻譯，就使用它
    // 否則使用英文版本作為後備
    const translations = LANGUAGE_TRANSLATIONS[uiLang] || LANGUAGE_TRANSLATIONS.en
    contentLocales[uiLang].languages = translations
  })
}

// 初始化時合併語言翻譯
mergeLanguageTranslations()

/**
 * 取得 Content Script 的國際化實例
 * 
 * @returns {Promise<Object>} 國際化物件
 * @returns {Function} .t - 翻譯函數，接受鍵值並返回對應的翻譯文字
 * @returns {string} .locale - 當前的語言代碼
 * 
 * @example
 * // 取得 i18n 實例
 * const i18n = await getContentI18n()
 * 
 * // 使用翻譯函數
 * i18n.t('translating') // '翻譯中...' (如果語言是繁體中文)
 * i18n.t('languages.ja') // '日文'
 * i18n.t('missing.key') // 'missing.key' (找不到時返回鍵值)
 */
export async function getContentI18n() {
  try {
    // 從 Chrome storage 取得語言設定
    const storage = await chrome.storage.local.get(['uiLanguage'])
    
    // 檢測使用者語言
    const detectedLocale = detectUserLanguage(
      navigator.language,
      storage.uiLanguage
    )
    
    // 創建翻譯函數
    const translator = createTranslator(contentLocales, detectedLocale)
    
    return {
      t: translator,
      locale: detectedLocale
    }
  } catch (error) {
    console.error('載入 content i18n 失敗：', error)
    
    // 錯誤時返回預設的英文版本
    const fallbackTranslator = createTranslator(contentLocales, 'en')
    return {
      t: fallbackTranslator,
      locale: 'en'
    }
  }
}

/**
 * Content Script i18n 實例的快取
 * 可以避免每次都重新創建
 * 
 * @type {Object|null}
 * @private
 */
let cachedI18n = null

/**
 * 取得快取的 i18n 實例
 * 第一次呼叫時會創建，之後會返回快取的實例
 * 
 * @returns {Promise<Object>} i18n 實例
 * @example
 * const i18n = await getCachedContentI18n()
 * console.log(i18n.t('translating'))
 */
export async function getCachedContentI18n() {
  if (!cachedI18n) {
    cachedI18n = await getContentI18n()
  }
  return cachedI18n
}

/**
 * 清除快取的 i18n 實例
 * 當語言設定變更時應該呼叫此函數
 */
export function clearContentI18nCache() {
  cachedI18n = null
}