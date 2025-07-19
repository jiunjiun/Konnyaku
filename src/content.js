/**
 * Konnyaku Translator Content Script
 * 主要的內容腳本入口檔案
 * 
 * 負責：
 * - 偵測用戶選取的文字
 * - 顯示浮動翻譯按鈕
 * - 管理翻譯彈出視窗
 * - 協調各個模組的互動
 */

import { UIManager } from './content/ui-manager.js'
import { setupEventListeners } from './content/event-handlers.js'

/**
 * 初始化內容腳本
 * 創建 UI 管理器並設定事件監聽器
 */
function initialize() {
  // 創建 UI 管理器實例
  const uiManager = new UIManager()
  
  // 設定所有事件監聽器
  setupEventListeners(uiManager)
  
  console.log('Konnyaku Translator: Content script initialized')
}

/**
 * 確保 DOM 載入完成後再初始化
 * 避免在 DOM 尚未就緒時執行腳本
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize)
} else {
  initialize()
}
