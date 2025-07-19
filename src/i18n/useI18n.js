/**
 * Vue 3 國際化組合式函數
 * 提供多語言支援的響應式功能
 * 
 * 與 content-i18n 的區別：
 * 1. 使用 Vue 的響應式系統，語言切換時自動更新 UI
 * 2. 提供設定頁面和彈出視窗的完整翻譯資源
 * 3. 支援語言切換功能
 * 
 * @module i18n/useI18n
 */

import { ref, computed, onMounted } from 'vue'
import { locales, detectUserLocale, supportedLocales } from './locales.js'
import { createReactiveTranslator, clearTranslationCache } from './translator.js'
import { STORAGE_KEYS } from '../constants/index.js'

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
      const storage = await chrome.storage.local.get([STORAGE_KEYS.UI_LANGUAGE])
      if (storage[STORAGE_KEYS.UI_LANGUAGE] && supportedLocales.includes(storage[STORAGE_KEYS.UI_LANGUAGE])) {
        currentLocale.value = storage[STORAGE_KEYS.UI_LANGUAGE]
      }
    } catch (error) {
      console.error('載入 UI 語言失敗：', error)
    } finally {
      isLoading.value = false
    }
  })

  /**
   * 翻譯函數
   * 使用響應式翻譯器，當語言切換時自動更新
   * 
   * @param {string} path - 翻譯鍵值路徑
   * @param {Object} [params] - 翻譯參數
   * @returns {string} 翻譯後的文字
   * 
   * @example
   * t('settings.title') // 'Konnyaku 設定'
   * t('settings.apiKey.label') // 'Gemini API 金鑰'
   * t('message', { count: 5 }) // '您有 5 則訊息'
   */
  const t = createReactiveTranslator(locales, currentLocale)

  /**
   * 設定當前語言
   * @param {string} locale - 語言代碼
   * @returns {Promise<void>}
   * 
   * @example
   * await setLocale('zh-TW') // 切換到繁體中文
   * await setLocale('ja') // 切換到日文
   */
  const setLocale = async (locale) => {
    if (supportedLocales.includes(locale)) {
      currentLocale.value = locale
      // 清除翻譯快取以確保使用新語言
      clearTranslationCache()
      
      try {
        await chrome.storage.local.set({ [STORAGE_KEYS.UI_LANGUAGE]: locale })
      } catch (error) {
        console.error('儲存 UI 語言失敗：', error)
      }
    }
  }

  /**
   * 取得當前語言的所有翻譯
   * 用於需要一次性獲取多個翻譯的情况
   */
  const translations = computed(() => locales[currentLocale.value] || locales.en)

  return {
    t,
    locale: currentLocale,
    setLocale,
    supportedLocales,
    isLoading,
    translations
  }
}

/**
 * 全域 i18n 實例
 * 可以在組件外使用
 * 
 * @example
 * import { globalI18n } from './i18n/useI18n.js'
 * 
 * // 在路由守衛中使用
 * router.beforeEach((to, from, next) => {
 *   document.title = globalI18n.t('app.title')
 *   next()
 * })
 */
export const globalI18n = {
  t: (key, params) => {
    // 提供一個簡單的全域翻譯函數
    // 這裡使用預設語言或英文
    const locale = detectUserLocale()
    const translator = createReactiveTranslator(locales, ref(locale))
    return translator(key, params)
  }
}
