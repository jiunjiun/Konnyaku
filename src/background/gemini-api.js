/**
 * Gemini API 模組
 * 負責與 Google Gemini API 進行通訊
 */

import { API, LANGUAGE_MAP } from '../constants/index.js'

/**
 * 調用 Gemini API 進行翻譯
 * @param {string} text - 要翻譯的文字
 * @param {string} targetLanguage - 目標語言代碼
 * @param {string} apiKey - API 金鑰
 * @returns {Promise<string>} 翻譯結果
 * @throws {Error} API 錯誤或無效回應
 */
export async function translateWithGemini(text, targetLanguage, apiKey) {
  const prompt = buildTranslationPrompt(text, targetLanguage)
  const response = await callGeminiAPI(prompt, apiKey)
  return extractTranslation(response)
}

/**
 * 建立翻譯提示詞
 * @param {string} text - 要翻譯的文字
 * @param {string} targetLanguageCode - 目標語言代碼
 * @returns {string} 格式化的提示詞
 */
function buildTranslationPrompt(text, targetLanguageCode) {
  const targetLanguageName = getLanguageName(targetLanguageCode)
  
  return `Please translate the following text to ${targetLanguageName}(${targetLanguageCode}).
Auto-detect the source language.
Only provide the translation without any explanation or additional text.

Text to translate: "${text}"`
}

/**
 * 調用 Gemini API
 * @param {string} prompt - 提示詞
 * @param {string} apiKey - API 金鑰
 * @returns {Promise<Object>} API 回應物件
 * @throws {Error} 網路錯誤或 API 錯誤
 */
async function callGeminiAPI(prompt, apiKey) {
  const url = `${API.BASE_URL}/models/${API.MODEL_NAME}:generateContent?key=${apiKey}`
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API error (${response.status}): ${parseAPIError(errorText, response.status)}`)
    }

    return response.json()
  } catch (error) {
    // 重新拋出更友善的錯誤訊息
    if (error.message.includes('Failed to fetch')) {
      throw new Error('無法連接到翻譯服務，請檢查網路連線')
    }
    throw error
  }
}

/**
 * 解析 API 錯誤訊息
 * @param {string} errorText - 原始錯誤文字
 * @param {number} statusCode - HTTP 狀態碼
 * @returns {string} 使用者友善的錯誤訊息
 */
function parseAPIError(errorText, statusCode) {
  // 嘗試解析 JSON 錯誤
  try {
    const errorObj = JSON.parse(errorText)
    if (errorObj.error?.message) {
      return errorObj.error.message
    }
  } catch (e) {
    // 忽略 JSON 解析錯誤
  }

  // 根據狀態碼返回對應的錯誤訊息
  switch (statusCode) {
    case 401:
      return 'API 金鑰無效或已過期'
    case 403:
      return 'API 金鑰沒有權限存取此服務'
    case 429:
      return '請求過於頻繁，請稍後再試'
    case 500:
    case 502:
    case 503:
      return '翻譯服務暫時無法使用，請稍後再試'
    default:
      return errorText || '發生未知錯誤'
  }
}

/**
 * 從 API 回應中提取翻譯文字
 * @param {Object} apiResponse - API 回應物件
 * @returns {string} 翻譯結果
 * @throws {Error} 無效的回應格式
 */
function extractTranslation(apiResponse) {
  const text = apiResponse?.candidates?.[0]?.content?.parts?.[0]?.text
  
  if (!text) {
    console.error('Invalid API response:', apiResponse)
    throw new Error('翻譯服務回應格式錯誤')
  }
  
  return text.trim()
}

/**
 * 獲取語言名稱
 * @param {string} code - 語言代碼
 * @returns {string} 語言名稱
 */
function getLanguageName(code) {
  return LANGUAGE_MAP[code] || code
}

/**
 * 驗證 API 金鑰格式
 * @param {string} apiKey - API 金鑰
 * @returns {boolean} 是否為有效格式
 */
export function validateApiKey(apiKey) {
  // Google API 金鑰通常是 39 個字元
  // 格式：AIza 開頭，後面跟著 35 個字元
  return /^AIza[a-zA-Z0-9-_]{35}$/.test(apiKey)
}