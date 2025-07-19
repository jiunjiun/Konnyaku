/**
 * 設定管理模組
 * 負責管理擴充功能的所有設定項目
 */

import { API, STORAGE_KEYS } from '../constants/index.js'

/**
 * 獲取完整的設定
 * @returns {Promise<Object>} 設定物件
 */
export async function getConfiguration() {
  const storage = await chrome.storage.local.get([
    STORAGE_KEYS.API_KEY,
    STORAGE_KEYS.TARGET_LANGUAGE,
    STORAGE_KEYS.PREFERRED_LANGUAGES,
    STORAGE_KEYS.UI_LANGUAGE
  ])

  return {
    apiKey: storage[STORAGE_KEYS.API_KEY] || '',
    targetLanguage: storage[STORAGE_KEYS.TARGET_LANGUAGE] || API.DEFAULT_TARGET_LANGUAGE,
    preferredLanguages: storage[STORAGE_KEYS.PREFERRED_LANGUAGES] || [],
    uiLanguage: storage[STORAGE_KEYS.UI_LANGUAGE] || 'en'
  }
}

/**
 * 保存設定
 * @param {Object} config - 要保存的設定物件
 * @returns {Promise<void>}
 */
export async function saveConfiguration(config) {
  const dataToSave = {}
  
  // 只保存有提供的設定項目
  if (config.apiKey !== undefined) {
    dataToSave[STORAGE_KEYS.API_KEY] = config.apiKey
  }
  if (config.targetLanguage !== undefined) {
    dataToSave[STORAGE_KEYS.TARGET_LANGUAGE] = config.targetLanguage
  }
  if (config.preferredLanguages !== undefined) {
    dataToSave[STORAGE_KEYS.PREFERRED_LANGUAGES] = config.preferredLanguages
  }
  if (config.uiLanguage !== undefined) {
    dataToSave[STORAGE_KEYS.UI_LANGUAGE] = config.uiLanguage
  }

  await chrome.storage.local.set(dataToSave)
}

/**
 * 獲取 API 金鑰
 * @returns {Promise<string>} API 金鑰
 */
export async function getApiKey() {
  const storage = await chrome.storage.local.get(STORAGE_KEYS.API_KEY)
  return storage[STORAGE_KEYS.API_KEY] || ''
}

/**
 * 設定 API 金鑰
 * @param {string} apiKey - API 金鑰
 * @returns {Promise<void>}
 */
export async function setApiKey(apiKey) {
  await chrome.storage.local.set({
    [STORAGE_KEYS.API_KEY]: apiKey
  })
}

/**
 * 獲取目標語言
 * @returns {Promise<string>} 目標語言代碼
 */
export async function getTargetLanguage() {
  const storage = await chrome.storage.local.get(STORAGE_KEYS.TARGET_LANGUAGE)
  return storage[STORAGE_KEYS.TARGET_LANGUAGE] || API.DEFAULT_TARGET_LANGUAGE
}

/**
 * 設定目標語言
 * @param {string} language - 語言代碼
 * @returns {Promise<void>}
 */
export async function setTargetLanguage(language) {
  await chrome.storage.local.set({
    [STORAGE_KEYS.TARGET_LANGUAGE]: language
  })
}

/**
 * 清除所有設定
 * @returns {Promise<void>}
 */
export async function clearAllSettings() {
  await chrome.storage.local.clear()
}

/**
 * 監聽設定變更
 * @param {Function} callback - 變更時的回調函數
 * @returns {Function} 取消監聽的函數
 */
export function onConfigurationChange(callback) {
  const listener = (changes, namespace) => {
    if (namespace === 'local') {
      const configChanges = {}
      
      // 檢查哪些設定項目有變更
      for (const key of Object.values(STORAGE_KEYS)) {
        if (changes[key]) {
          configChanges[key] = changes[key].newValue
        }
      }
      
      if (Object.keys(configChanges).length > 0) {
        callback(configChanges)
      }
    }
  }

  chrome.storage.onChanged.addListener(listener)

  // 返回取消監聽的函數
  return () => {
    chrome.storage.onChanged.removeListener(listener)
  }
}