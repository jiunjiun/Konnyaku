/**
 * 翻譯服務模組
 * 負責處理翻譯請求和響應
 */

import { MESSAGE_ACTIONS, STORAGE_KEYS } from '../constants/index.js'
import { getContentI18n } from '../i18n/content-i18n.js'

/**
 * 執行翻譯
 * @param {string} text - 要翻譯的文字
 * @returns {Promise<{success: boolean, translation?: string, error?: string}>} 翻譯結果
 */
export async function performTranslation(text) {
  try {
    const response = await chrome.runtime.sendMessage({
      action: MESSAGE_ACTIONS.TRANSLATE,
      text: text
    })

    if (response.error) {
      return { success: false, error: response.error }
    }

    return { success: true, translation: response.translation }
  } catch (err) {
    console.error('Translation error:', err)
    
    // 獲取 i18n 實例以顯示本地化錯誤訊息
    const i18n = await getContentI18n()
    return { success: false, error: i18n.t('failedToTranslate') }
  }
}

/**
 * 獲取用戶的語言設定
 * @returns {Promise<Object>} 包含目標語言和偏好語言列表的物件
 */
export async function getLanguageSettings() {
  const storage = await chrome.storage.local.get([
    STORAGE_KEYS.TARGET_LANGUAGE,
    STORAGE_KEYS.PREFERRED_LANGUAGES
  ])

  return {
    targetLanguage: storage.targetLanguage || 'zh-TW',
    preferredLanguages: storage.preferredLanguages || []
  }
}

/**
 * 保存目標語言設定
 * @param {string} language - 語言代碼
 * @returns {Promise<void>}
 */
export async function saveTargetLanguage(language) {
  await chrome.storage.local.set({
    [STORAGE_KEYS.TARGET_LANGUAGE]: language
  })
}

/**
 * 獲取所有可用語言列表
 * @returns {Promise<Array<Object>>} 語言列表，包含 code 和 name
 */
export async function getAvailableLanguages() {
  const i18n = await getContentI18n()
  
  return [
    { code: 'zh-TW', name: i18n.t('languages.zh-TW') },
    { code: 'zh-CN', name: i18n.t('languages.zh-CN') },
    { code: 'ja', name: i18n.t('languages.ja') },
    { code: 'ko', name: i18n.t('languages.ko') },
    { code: 'en', name: i18n.t('languages.en') },
    { code: 'es', name: i18n.t('languages.es') },
    { code: 'fr', name: i18n.t('languages.fr') },
    { code: 'de', name: i18n.t('languages.de') },
    { code: 'it', name: i18n.t('languages.it') },
    { code: 'pt', name: i18n.t('languages.pt') },
    { code: 'ru', name: i18n.t('languages.ru') },
    { code: 'ar', name: i18n.t('languages.ar') },
    { code: 'hi', name: i18n.t('languages.hi') },
    { code: 'th', name: i18n.t('languages.th') },
    { code: 'vi', name: i18n.t('languages.vi') }
  ]
}

/**
 * 根據用戶偏好過濾語言列表
 * @param {Array<Object>} allLanguages - 所有語言列表
 * @param {Array<string>} preferredLanguages - 偏好語言代碼列表
 * @returns {Array<Object>} 過濾後的語言列表
 */
export function filterLanguagesByPreference(allLanguages, preferredLanguages) {
  if (!preferredLanguages || preferredLanguages.length === 0) {
    return allLanguages
  }

  return allLanguages.filter(lang => preferredLanguages.includes(lang.code))
}

/**
 * 開啟選項頁面
 * @returns {Promise<void>}
 */
export async function openOptionsPage() {
  try {
    await chrome.runtime.sendMessage({ 
      action: MESSAGE_ACTIONS.OPEN_OPTIONS_PAGE 
    })
  } catch (error) {
    console.error('Error opening options page:', error)
  }
}