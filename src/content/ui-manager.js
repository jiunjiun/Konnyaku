/**
 * UI 管理模組
 * 負責管理浮動按鈕和翻譯彈出視窗的顯示狀態
 */

import { FLOATING_BUTTON_OFFSET, TRANSLATION_POPUP_OFFSET } from '../constants/index.js'
import { createFloatingButton, createTranslationPopup, updatePopupHeader, showLoadingState, showTranslationResult, showError } from './ui-components.js'
import { performTranslation, getLanguageSettings, saveTargetLanguage, getAvailableLanguages, filterLanguagesByPreference, openOptionsPage } from './translation-service.js'
import { getContentI18n } from '../i18n/content-i18n.js'

/**
 * UI 管理器類別
 * 管理所有 UI 元素的生命週期和狀態
 */
export class UIManager {
  constructor() {
    /**
     * @type {HTMLElement|null} 浮動按鈕容器
     */
    this.floatingButtonContainer = null
    
    /**
     * @type {HTMLElement|null} 翻譯彈出視窗容器
     */
    this.translationPopupContainer = null
    
    /**
     * @type {{x: number, y: number}} 最後的滑鼠位置
     */
    this.lastMousePosition = { x: 0, y: 0 }
    
    /**
     * @type {Object|null} i18n 實例
     */
    this.i18n = null
  }

  /**
   * 顯示浮動按鈕
   * @param {number} x - X 座標
   * @param {number} y - Y 座標
   * @returns {Promise<void>}
   */
  async showFloatingButton(x, y) {
    if (!this.floatingButtonContainer) {
      this.floatingButtonContainer = await createFloatingButton()
      
      // 設定按鈕點擊事件
      this.floatingButtonContainer.buttonElement.addEventListener('click', (e) => {
        e.stopPropagation()
        this.translateSelectedText()
      })
      
      document.body.appendChild(this.floatingButtonContainer)
    }

    // 使用傳入的座標位置
    this.floatingButtonContainer.style.left = `${x - FLOATING_BUTTON_OFFSET.X}px`
    this.floatingButtonContainer.style.top = `${y - FLOATING_BUTTON_OFFSET.Y}px`
    this.floatingButtonContainer.style.display = 'block'
  }

  /**
   * 隱藏浮動按鈕
   */
  hideFloatingButton() {
    if (this.floatingButtonContainer) {
      this.floatingButtonContainer.style.display = 'none'
    }
  }

  /**
   * 隱藏翻譯彈出視窗
   */
  hideTranslationPopup() {
    if (this.translationPopupContainer) {
      this.translationPopupContainer.remove()
      this.translationPopupContainer = null
    }
  }

  /**
   * 更新最後的滑鼠位置
   * @param {number} x - X 座標
   * @param {number} y - Y 座標
   */
  updateMousePosition(x, y) {
    this.lastMousePosition = { x, y }
  }

  /**
   * 檢查點擊是否在元素內
   * @param {HTMLElement} element - 要檢查的元素
   * @param {Event} event - 點擊事件
   * @returns {boolean}
   */
  isClickInsideElement(element, event) {
    return element && element.contains(event.target)
  }

  /**
   * 執行翻譯選取的文字
   * @returns {Promise<void>}
   */
  async translateSelectedText() {
    const selectedText = window.getSelection().toString().trim()
    if (!selectedText) return

    // 初始化 i18n
    if (!this.i18n) {
      this.i18n = await getContentI18n()
    }

    // 創建或顯示翻譯彈出視窗
    await this.showTranslationPopup()

    // 設定彈出視窗內容
    await this.setupTranslationPopup(selectedText)

    // 隱藏浮動按鈕
    this.hideFloatingButton()
  }

  /**
   * 顯示翻譯彈出視窗
   * @returns {Promise<void>}
   */
  async showTranslationPopup() {
    if (!this.translationPopupContainer) {
      this.translationPopupContainer = await createTranslationPopup()
      document.body.appendChild(this.translationPopupContainer)
    }

    this.translationPopupContainer.style.left = `${this.lastMousePosition.x + TRANSLATION_POPUP_OFFSET.X}px`
    this.translationPopupContainer.style.top = `${this.lastMousePosition.y + TRANSLATION_POPUP_OFFSET.Y}px`
  }

  /**
   * 設定翻譯彈出視窗的內容和事件
   * @param {string} selectedText - 要翻譯的文字
   * @returns {Promise<void>}
   */
  async setupTranslationPopup(selectedText) {
    const popup = this.translationPopupContainer.popupElement

    // 獲取語言設定
    const { targetLanguage, preferredLanguages } = await getLanguageSettings()
    const allLanguages = await getAvailableLanguages()
    const filteredLanguages = filterLanguagesByPreference(allLanguages, preferredLanguages)

    // 更新彈出視窗標題
    const { languageSelector, settingsBtn } = updatePopupHeader(popup, filteredLanguages, targetLanguage)

    // 顯示載入狀態
    showLoadingState(popup, this.i18n)

    // 設定事件監聽器
    this.setupEventListeners(languageSelector, settingsBtn, selectedText)

    // 執行翻譯
    await this.doTranslation(selectedText)
  }

  /**
   * 設定事件監聽器
   * @param {HTMLElement} languageSelector - 語言選擇器
   * @param {HTMLElement} settingsBtn - 設定按鈕
   * @param {string} selectedText - 選取的文字
   */
  setupEventListeners(languageSelector, settingsBtn, selectedText) {
    // 語言選擇器事件
    if (languageSelector) {
      languageSelector.addEventListener('change', async (e) => {
        const newLang = e.target.value
        await saveTargetLanguage(newLang)
        
        // 重新顯示載入狀態並翻譯
        showLoadingState(this.translationPopupContainer.popupElement, this.i18n)
        await this.doTranslation(selectedText)
      })
    }

    // 設定按鈕事件
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => {
        openOptionsPage()
      })
    }
  }

  /**
   * 執行翻譯並更新 UI
   * @param {string} text - 要翻譯的文字
   * @returns {Promise<void>}
   */
  async doTranslation(text) {
    const popup = this.translationPopupContainer.popupElement
    const result = await performTranslation(text)

    if (result.success) {
      showTranslationResult(popup, result.translation)
    } else {
      showError(popup, result.error, this.i18n)
    }
  }
}