/**
 * 統一的翻譯功能模組
 * 提供核心翻譯邏輯，避免重複實作
 * 
 * @module i18n/translator
 */

/**
 * 翻譯函數快取
 * 用於儲存已解析的翻譯路徑，提升效能
 * 
 * @type {Map<string, Array<string>>}
 */
const pathCache = new Map()

/**
 * 翻譯結果快取
 * 儲存最近的翻譯結果，避免重複查找
 * 
 * @type {Map<string, string>}
 */
const translationCache = new Map()

/**
 * 最大快取大小
 * @constant {number}
 */
const MAX_CACHE_SIZE = 1000

/**
 * 解析翻譯鍵值路徑
 * 將點分隔的路徑轉換為陣列，並快取結果
 * 
 * @param {string} key - 翻譯鍵值（如 'settings.apiKey.label'）
 * @returns {Array<string>} 路徑陣列
 * @private
 */
function parsePath(key) {
  if (pathCache.has(key)) {
    return pathCache.get(key)
  }
  
  const path = key.split('.')
  
  // 限制快取大小
  if (pathCache.size >= MAX_CACHE_SIZE) {
    const firstKey = pathCache.keys().next().value
    pathCache.delete(firstKey)
  }
  
  pathCache.set(key, path)
  return path
}

/**
 * 根據路徑獲取巢狀物件的值
 * 
 * @param {Object} obj - 要查找的物件
 * @param {Array<string>} path - 路徑陣列
 * @returns {*} 找到的值或 undefined
 * @private
 */
function getNestedValue(obj, path) {
  let value = obj
  
  for (const key of path) {
    value = value?.[key]
    if (value === undefined) {
      return undefined
    }
  }
  
  return value
}

/**
 * 創建翻譯函數
 * 
 * @param {Object} locales - 所有語言的翻譯資源
 * @param {string} currentLocale - 當前語言代碼
 * @param {string} [fallbackLocale='en'] - 後備語言代碼
 * @returns {Function} 翻譯函數
 * @example
 * const locales = {
 *   en: { greeting: 'Hello', nested: { message: 'Welcome' } },
 *   'zh-TW': { greeting: '你好', nested: { message: '歡迎' } }
 * }
 * 
 * const t = createTranslator(locales, 'zh-TW')
 * t('greeting') // '你好'
 * t('nested.message') // '歡迎'
 * t('missing.key') // 'missing.key'
 */
export function createTranslator(locales, currentLocale, fallbackLocale = 'en') {
  const currentTranslations = locales[currentLocale] || locales[fallbackLocale]
  const fallbackTranslations = locales[fallbackLocale]
  
  // 創建快取鍵值前綴，用於區分不同語言的快取
  const cacheKeyPrefix = `${currentLocale}:`
  
  /**
   * 翻譯函數
   * 
   * @param {string} key - 翻譯鍵值
   * @param {Object} [params] - 替換參數
   * @returns {string} 翻譯結果
   */
  return function translate(key, params = {}) {
    // 檢查快取
    const cacheKey = cacheKeyPrefix + key
    if (translationCache.has(cacheKey) && Object.keys(params).length === 0) {
      return translationCache.get(cacheKey)
    }
    
    // 解析路徑並查找翻譯
    const path = parsePath(key)
    let value = getNestedValue(currentTranslations, path)
    
    // 如果當前語言找不到，嘗試後備語言
    if (value === undefined && currentLocale !== fallbackLocale) {
      value = getNestedValue(fallbackTranslations, path)
    }
    
    // 如果都找不到，返回鍵值
    if (value === undefined) {
      return key
    }
    
    // 確保返回字串
    let result = String(value)
    
    // 處理參數替換
    if (Object.keys(params).length > 0) {
      result = interpolate(result, params)
    } else {
      // 只快取沒有參數的翻譯
      if (translationCache.size >= MAX_CACHE_SIZE) {
        const firstKey = translationCache.keys().next().value
        translationCache.delete(firstKey)
      }
      translationCache.set(cacheKey, result)
    }
    
    return result
  }
}

/**
 * 字串插值函數
 * 將 {key} 形式的佔位符替換為實際值
 * 
 * @param {string} template - 模板字串
 * @param {Object} params - 參數物件
 * @returns {string} 替換後的字串
 * @example
 * interpolate('Hello {name}!', { name: 'World' }) // 'Hello World!'
 * interpolate('{count} items', { count: 5 }) // '5 items'
 */
export function interpolate(template, params) {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return params.hasOwnProperty(key) ? String(params[key]) : match
  })
}

/**
 * 創建響應式翻譯函數（用於 Vue）
 * 
 * @param {Object} locales - 所有語言的翻譯資源
 * @param {import('vue').Ref<string>} localeRef - Vue 的響應式語言引用
 * @param {string} [fallbackLocale='en'] - 後備語言代碼
 * @returns {Function} 響應式翻譯函數
 */
export function createReactiveTranslator(locales, localeRef, fallbackLocale = 'en') {
  return function translate(key, params) {
    // 每次調用時都使用當前的 locale 值
    const translator = createTranslator(locales, localeRef.value, fallbackLocale)
    return translator(key, params)
  }
}

/**
 * 清除翻譯快取
 * 在語言切換或資源更新時調用
 */
export function clearTranslationCache() {
  pathCache.clear()
  translationCache.clear()
}

/**
 * 獲取快取統計資訊
 * 用於調試和效能監控
 * 
 * @returns {Object} 快取統計
 */
export function getCacheStats() {
  return {
    pathCacheSize: pathCache.size,
    translationCacheSize: translationCache.size,
    maxCacheSize: MAX_CACHE_SIZE
  }
}

/**
 * 檢查翻譯鍵值是否存在
 * 
 * @param {Object} locales - 所有語言的翻譯資源
 * @param {string} locale - 語言代碼
 * @param {string} key - 翻譯鍵值
 * @returns {boolean} 是否存在
 */
export function hasTranslation(locales, locale, key) {
  const translations = locales[locale]
  if (!translations) return false
  
  const path = parsePath(key)
  const value = getNestedValue(translations, path)
  
  return value !== undefined
}

/**
 * 批量翻譯多個鍵值
 * 用於一次性獲取多個翻譯，提升效能
 * 
 * @param {Function} translator - 翻譯函數
 * @param {Array<string|{key: string, params?: Object}>} keys - 鍵值陣列
 * @returns {Object.<string, string>} 翻譯結果物件
 * @example
 * const translations = batchTranslate(t, [
 *   'greeting',
 *   { key: 'welcome', params: { name: 'User' } },
 *   'goodbye'
 * ])
 * // { greeting: 'Hello', welcome: 'Welcome User', goodbye: 'Goodbye' }
 */
export function batchTranslate(translator, keys) {
  const results = {}
  
  for (const item of keys) {
    if (typeof item === 'string') {
      results[item] = translator(item)
    } else if (item && typeof item === 'object' && item.key) {
      results[item.key] = translator(item.key, item.params || {})
    }
  }
  
  return results
}