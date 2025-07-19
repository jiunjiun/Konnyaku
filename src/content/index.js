/**
 * Content Script 主入口
 * 整合所有模組並初始化功能
 */

import { UIManager } from './ui-manager.js'
import { setupEventListeners } from './event-handlers.js'

/**
 * 初始化 Content Script
 */
function initialize() {
  // 創建 UI 管理器實例
  const uiManager = new UIManager()
  
  // 設定所有事件監聽器
  setupEventListeners(uiManager)
  
  console.log('Konnyaku Translator: Content script initialized')
}

// 確保 DOM 載入完成後初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize)
} else {
  initialize()
}