/**
 * 事件處理模組
 * 負責設定和管理所有的事件監聽器
 */

import { EVENT_DELAYS, MESSAGE_ACTIONS } from '../constants/index.js'

/**
 * 設定所有事件監聽器
 * @param {UIManager} uiManager - UI 管理器實例
 */
export function setupEventListeners(uiManager) {
  // 滑鼠釋放事件 - 顯示浮動按鈕
  setupMouseUpHandler(uiManager)
  
  // 滑鼠按下事件 - 檢查點擊位置
  setupMouseDownHandler(uiManager)
  
  // 選取變更事件 - 監控文字選取狀態
  setupSelectionChangeHandler(uiManager)
  
  // Chrome runtime 訊息處理
  setupMessageHandler()
}

/**
 * 設定滑鼠釋放事件處理器
 * @param {UIManager} uiManager - UI 管理器實例
 */
function setupMouseUpHandler(uiManager) {
  document.addEventListener('mouseup', (e) => {
    // 更新滑鼠位置（包含捲動偏移）
    const x = e.clientX + window.scrollX
    const y = e.clientY + window.scrollY
    uiManager.updateMousePosition(x, y)
    
    // 延遲檢查文字選取，確保選取狀態已更新
    setTimeout(() => {
      const selection = window.getSelection()
      const selectedText = selection.toString().trim()

      if (selectedText && selectedText.length > 0) {
        uiManager.showFloatingButton(x, y)
      } else {
        uiManager.hideFloatingButton()
      }
    }, EVENT_DELAYS.SELECTION_CHECK)
  })
}

/**
 * 設定滑鼠按下事件處理器
 * @param {UIManager} uiManager - UI 管理器實例
 */
function setupMouseDownHandler(uiManager) {
  document.addEventListener('mousedown', (e) => {
    // 檢查是否點擊在浮動按鈕外
    if (!uiManager.isClickInsideElement(uiManager.floatingButtonContainer, e)) {
      uiManager.hideFloatingButton()
    }
    
    // 檢查是否點擊在翻譯彈出視窗外
    if (!uiManager.isClickInsideElement(uiManager.translationPopupContainer, e)) {
      uiManager.hideTranslationPopup()
    }
  })
}

/**
 * 設定選取變更事件處理器
 * @param {UIManager} uiManager - UI 管理器實例
 */
function setupSelectionChangeHandler(uiManager) {
  document.addEventListener('selectionchange', () => {
    const selectedText = window.getSelection().toString().trim()
    if (!selectedText) {
      uiManager.hideFloatingButton()
    }
  })
}

/**
 * 設定 Chrome runtime 訊息處理器
 */
function setupMessageHandler() {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === MESSAGE_ACTIONS.GET_SELECTED_TEXT) {
      const selectedText = window.getSelection().toString().trim()
      sendResponse({ selectedText })
    }
    return true
  })
}

/**
 * 清理所有事件監聽器
 * 用於擴展卸載或頁面離開時
 */
export function cleanupEventListeners() {
  // 移除所有事件監聽器
  document.removeEventListener('mouseup', () => {})
  document.removeEventListener('mousedown', () => {})
  document.removeEventListener('selectionchange', () => {})
}

/**
 * 防抖函數
 * @param {Function} func - 要防抖的函數
 * @param {number} delay - 延遲時間（毫秒）
 * @returns {Function} 防抖後的函數
 */
export function debounce(func, delay) {
  let timeoutId
  
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

/**
 * 節流函數
 * @param {Function} func - 要節流的函數
 * @param {number} limit - 限制時間（毫秒）
 * @returns {Function} 節流後的函數
 */
export function throttle(func, limit) {
  let inThrottle
  
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}