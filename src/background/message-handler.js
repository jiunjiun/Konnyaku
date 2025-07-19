/**
 * 訊息處理模組
 * 負責處理來自 content script 和其他部分的訊息
 */

import { MESSAGE_ACTIONS } from '../constants/index.js'
import { translateWithGemini } from './gemini-api.js'
import { getConfiguration } from './config-manager.js'

/**
 * 初始化訊息處理器
 */
export function initializeMessageHandler() {
  chrome.runtime.onMessage.addListener(handleMessage)
}

/**
 * 處理收到的訊息
 * @param {Object} request - 請求物件
 * @param {Object} sender - 發送者資訊
 * @param {Function} sendResponse - 回應函數
 * @returns {boolean} 是否為非同步處理
 */
function handleMessage(request, sender, sendResponse) {
  // 根據動作類型分發處理
  const handlers = {
    [MESSAGE_ACTIONS.TRANSLATE]: () => handleTranslation(request.text).then(sendResponse),
    [MESSAGE_ACTIONS.OPEN_OPTIONS_PAGE]: () => handleOpenOptionsPage().then(sendResponse)
  }

  const handler = handlers[request.action]
  if (handler) {
    handler()
    return true // 保持訊息通道開啟以進行非同步回應
  }

  // 未知的動作
  console.warn('Unknown message action:', request.action)
  sendResponse({ error: 'Unknown action' })
  return false
}

/**
 * 處理翻譯請求
 * @param {string} text - 要翻譯的文字
 * @returns {Promise<Object>} 翻譯結果或錯誤訊息
 */
async function handleTranslation(text) {
  try {
    // 驗證輸入
    if (!text || typeof text !== 'string') {
      return { error: '請提供有效的文字' }
    }

    // 檢查文字長度
    if (text.length > 5000) {
      return { error: '文字過長，請選擇較短的內容' }
    }

    // 獲取設定
    const config = await getConfiguration()
    if (!config.apiKey) {
      return { error: '請先在設定中配置 API 金鑰' }
    }

    // 執行翻譯
    const translation = await translateWithGemini(
      text, 
      config.targetLanguage, 
      config.apiKey
    )

    return { translation }
  } catch (error) {
    console.error('Translation error:', error)
    
    // 返回使用者友善的錯誤訊息
    return { 
      error: error.message || '翻譯失敗，請稍後再試' 
    }
  }
}

/**
 * 處理開啟選項頁面請求
 * @returns {Promise<Object>} 操作結果
 */
async function handleOpenOptionsPage() {
  try {
    await chrome.runtime.openOptionsPage()
    return { success: true }
  } catch (error) {
    console.error('Error opening options page:', error)
    return { 
      error: error.message || '無法開啟設定頁面' 
    }
  }
}

/**
 * 發送訊息到 content script
 * @param {number} tabId - 標籤頁 ID
 * @param {Object} message - 訊息物件
 * @returns {Promise<any>} 回應結果
 */
export async function sendMessageToTab(tabId, message) {
  try {
    return await chrome.tabs.sendMessage(tabId, message)
  } catch (error) {
    console.error('Error sending message to tab:', error)
    throw error
  }
}

/**
 * 廣播訊息到所有標籤頁
 * @param {Object} message - 訊息物件
 * @returns {Promise<void>}
 */
export async function broadcastMessage(message) {
  const tabs = await chrome.tabs.query({})
  const promises = tabs.map(tab => 
    sendMessageToTab(tab.id, message).catch(err => 
      console.warn(`Failed to send message to tab ${tab.id}:`, err)
    )
  )
  await Promise.all(promises)
}