/**
 * Konnyaku Translator Background Script
 * 主要的背景腳本入口檔案
 * 
 * 負責：
 * - 處理來自 content script 的訊息
 * - 調用 Gemini API 進行翻譯
 * - 管理擴充功能的設定
 * - 協調各個背景模組的運作
 */

import { initializeMessageHandler } from './background/message-handler.js'
import { onConfigurationChange } from './background/config-manager.js'

/**
 * 初始化背景腳本
 */
function initialize() {
  // 初始化訊息處理器
  initializeMessageHandler()
  
  // 監聽設定變更（如需要可在此處理）
  const unsubscribe = onConfigurationChange((changes) => {
    console.log('Configuration changed:', changes)
  })
  
  // 擴充功能安裝或更新時的處理
  chrome.runtime.onInstalled.addListener(handleInstallOrUpdate)
  
  console.log('Konnyaku Translator: Background script initialized')
}

/**
 * 處理擴充功能安裝或更新
 * @param {Object} details - 安裝詳情
 */
function handleInstallOrUpdate(details) {
  if (details.reason === 'install') {
    console.log('Extension installed')
    // 首次安裝時可開啟選項頁面
    chrome.runtime.openOptionsPage()
  } else if (details.reason === 'update') {
    console.log('Extension updated from', details.previousVersion)
    // 更新時的處理邏輯
  }
}

// 初始化背景腳本
initialize()