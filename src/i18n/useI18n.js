/**
 * Vue 3 國際化組合式函數
 * 提供多語言支援的響應式功能
 */

import { ref, computed, onMounted } from 'vue'
import { locales, detectUserLocale, supportedLocales } from './locales.js'

/**
 * 國際化組合式函數
 * @returns {Object} 國際化相關的響應式資料和方法
 * @returns {Function} .t - 翻譯函數
 * @returns {Ref<string>} .locale - 當前語言
 * @returns {Function} .setLocale - 設定語言函數
 * @returns {string[]} .supportedLocales - 支援的語言列表
 * @returns {Ref<boolean>} .isLoading - 載入狀態
 */
export function useI18n() {
  const currentLocale = ref(detectUserLocale())
  const isLoading = ref(true)

  onMounted(async () => {
    try {
      const storage = await chrome.storage.local.get(['uiLanguage'])
      if (storage.uiLanguage && supportedLocales.includes(storage.uiLanguage)) {
        currentLocale.value = storage.uiLanguage
      }
    } catch (error) {
      console.error('載入 UI 語言失敗：', error)
    } finally {
      isLoading.value = false
    }
  })

  /**
   * 翻譯函數
   * @param {string} path - 翻譯鍵值路徑
   * @returns {string} 翻譯後的文字
   */
  const t = (path) => {
    const locale = currentLocale.value
    const translations = locales[locale] || locales.en
    
    const keys = path.split('.')
    let value = translations

    for (const key of keys) {
      value = value?.[key]
      if (value === undefined) {
        const fallback = locales.en
        let fallbackValue = fallback
        for (const k of keys) {
          fallbackValue = fallbackValue?.[k]
        }
        return fallbackValue || path
      }
    }

    return value
  }

  /**
   * 設定當前語言
   * @param {string} locale - 語言代碼
   * @returns {Promise<void>}
   */
  const setLocale = async (locale) => {
    if (supportedLocales.includes(locale)) {
      currentLocale.value = locale
      try {
        await chrome.storage.local.set({ uiLanguage: locale })
      } catch (error) {
        console.error('儲存 UI 語言失敗：', error)
      }
    }
  }

  return {
    t,
    locale: currentLocale,
    setLocale,
    supportedLocales,
    isLoading
  }
}
