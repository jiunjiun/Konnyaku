/**
 * UI 元件模組
 * 負責創建和管理浮動按鈕與翻譯彈出視窗
 */

import { loadShadowCSS } from './css-loader.js'
import { DOM } from '../constants/index.js'
import { getContentI18n } from '../i18n/content-i18n.js'

/**
 * 創建浮動翻譯按鈕
 * @returns {Promise<HTMLElement>} 返回按鈕容器元素
 */
export async function createFloatingButton() {
  // 創建容器元素
  const container = document.createElement('div')
  container.id = DOM.FLOATING_BUTTON_ID
  container.className = DOM.FLOATING_BUTTON_CLASS

  // 創建 Shadow DOM
  const shadow = container.attachShadow({ mode: 'closed' })

  // 添加 CSS 樣式
  const style = document.createElement('style')
  style.textContent = await loadShadowCSS(DOM.FLOATING_BUTTON_CSS_SELECTOR)

  // 創建按鈕
  const button = document.createElement('button')
  button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
      <path d="m5 8 6 6"/>
      <path d="m4 14 6-6 2-3"/>
      <path d="M2 5h12"/>
      <path d="M7 2h1"/>
      <path d="m22 22-5-10-5 10"/>
      <path d="M14 18h6"/>
    </svg>
  `

  shadow.appendChild(style)
  shadow.appendChild(button)

  // 保存按鈕引用以便外部訪問
  container.buttonElement = button

  return container
}

/**
 * 創建翻譯彈出視窗
 * @returns {Promise<HTMLElement>} 返回彈出視窗容器元素
 */
export async function createTranslationPopup() {
  // 創建容器元素
  const container = document.createElement('div')
  container.id = DOM.TRANSLATION_POPUP_ID
  container.className = DOM.TRANSLATION_POPUP_CLASS

  // 創建 Shadow DOM
  const shadow = container.attachShadow({ mode: 'closed' })

  // 添加 CSS 樣式
  const style = document.createElement('style')
  style.textContent = await loadShadowCSS(DOM.TRANSLATION_POPUP_CSS_SELECTOR)

  // 創建彈出窗口內容
  const popup = document.createElement('div')
  popup.className = 'popup'

  shadow.appendChild(style)
  shadow.appendChild(popup)

  // 保存引用以便後續使用
  container.popupElement = popup
  // shadowRoot 是只讀屬性，不需要手動設置
  // 可以通過 container.shadowRoot 直接訪問

  return container
}

/**
 * 生成語言選項的 HTML
 * @param {Array<Object>} languages - 語言列表
 * @param {string} currentLang - 當前選中的語言
 * @returns {string} 語言選項的 HTML 字符串
 */
function generateLanguageOptions(languages, currentLang) {
  return languages
    .map((lang) => `<option value="${lang.code}" ${currentLang === lang.code ? 'selected' : ''}>${lang.name}</option>`)
    .join('')
}

/**
 * 更新翻譯彈出視窗的標題區域
 * @param {HTMLElement} popup - 彈出視窗元素
 * @param {Array<Object>} languages - 可用語言列表
 * @param {string} currentLang - 當前語言
 * @returns {Object} 返回語言選擇器和設定按鈕的引用
 */
export function updatePopupHeader(popup, languages, currentLang) {
  const languageOptions = generateLanguageOptions(languages, currentLang)

  const headerHTML = `
    <div class="header">
      <div class="flex">
        <img src="${chrome.runtime.getURL('src/assets/images/logo.png')}" alt="Konnyaku">
        <select class="language-selector" id="language-selector">
          ${languageOptions}
        </select>
      </div>
      <button class="settings-btn" id="settings-btn">
        <svg class="lucide lucide-settings2-icon lucide-settings-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 17H5"/><path d="M19 7h-9"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
      </button>
    </div>
  `

  // 如果已有 header，只更新內容；否則創建新的
  let header = popup.querySelector('.header')
  if (header) {
    header.outerHTML = headerHTML
  } else {
    popup.insertAdjacentHTML('afterbegin', headerHTML)
  }

  return {
    languageSelector: popup.querySelector('#language-selector'),
    settingsBtn: popup.querySelector('#settings-btn')
  }
}

/**
 * 顯示載入中狀態
 * @param {HTMLElement} popup - 彈出視窗元素
 * @param {Object} i18n - 國際化物件
 */
export function showLoadingState(popup, i18n) {
  const content = popup.querySelector('.translation-content') || createContentArea(popup)

  content.innerHTML = `
    <div class="loading">
      <svg class="animate-spin lucide lucide-loader-circle-icon lucide-loader-circle" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      <span>${i18n.t('translating')}</span>
    </div>
  `
}

/**
 * 顯示翻譯結果
 * @param {HTMLElement} popup - 彈出視窗元素
 * @param {string} translation - 翻譯結果
 */
export function showTranslationResult(popup, translation) {
  const content = popup.querySelector('.translation-content') || createContentArea(popup)

  content.innerHTML = `
    <div class="translation-result">
      <div class="translation-text">${translation}</div>
    </div>
  `
}

/**
 * 顯示錯誤訊息
 * @param {HTMLElement} popup - 彈出視窗元素
 * @param {string} error - 錯誤訊息
 * @param {Object} i18n - 國際化物件
 */
export function showError(popup, error, i18n) {
  const content = popup.querySelector('.translation-content') || createContentArea(popup)

  content.innerHTML = `
    <div class="error">
      <strong>${i18n.t('error')}</strong> ${error}
    </div>
  `
}

/**
 * 創建內容區域
 * @param {HTMLElement} popup - 彈出視窗元素
 * @returns {HTMLElement} 內容區域元素
 */
function createContentArea(popup) {
  const content = document.createElement('div')
  content.className = 'translation-content'
  popup.appendChild(content)
  return content
}
