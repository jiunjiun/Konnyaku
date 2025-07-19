import { getContentI18n } from './i18n/content-i18n.js'

let floatingButtonContainer = null
let translationPopupContainer = null
let lastMousePosition = { x: 0, y: 0 }
let cssText = null
let i18n = null

// 加载外部 CSS 文件
async function loadCSS() {
  if (cssText) return cssText

  try {
    const response = await fetch(chrome.runtime.getURL('src/content.css'))
    cssText = await response.text()
    return cssText
  } catch (error) {
    console.error('Failed to load CSS:', error)
    return ''
  }
}

// 从 CSS 文本中提取 Shadow DOM 样式
function extractShadowCSS(cssText, selector) {
  const lines = cssText.split('\n')
  const result = []
  let inTargetSection = false
  let braceCount = 0
  let inKeyframes = false

  for (let line of lines) {
    // 檢查是否進入 @keyframes
    if (line.includes('@keyframes')) {
      inKeyframes = true
      result.push(line)
      continue
    }

    // 處理 @keyframes 內容
    if (inKeyframes) {
      result.push(line)
      braceCount += (line.match(/{/g) || []).length
      braceCount -= (line.match(/}/g) || []).length
      if (braceCount === 0 && line.includes('}')) {
        inKeyframes = false
      }
      continue
    }

    // 檢查是否是目標選擇器
    if (line.includes(selector)) {
      inTargetSection = true
    }

    if (inTargetSection) {
      // 计算大括号
      braceCount += (line.match(/{/g) || []).length
      braceCount -= (line.match(/}/g) || []).length

      // 替换选择器
      let processedLine = line

      // 處理主選擇器
      if (line.includes(selector)) {
        processedLine = processedLine.replace(new RegExp(selector.replace(/\./g, '\\.'), 'g'), ':host')
      }

      // 清理選擇器前綴
      processedLine = processedLine
        .replace(/\.konnyaku-floating-button-shadow-css\s+/g, '')
        .replace(/\.konnyaku-translation-popup-shadow-css\s+/g, '')

      result.push(processedLine)

      // 如果大括号计数为0，表示该规则组结束
      if (braceCount === 0 && line.includes('}')) {
        inTargetSection = false
      }
    }
  }

  return result.join('\n')
}

async function createFloatingButton() {
  // 創建容器元素
  const container = document.createElement('div')
  container.id = 'konnyaku-floating-container'
  container.className = 'konnyaku-floating-container'

  // 創建 Shadow DOM
  const shadow = container.attachShadow({ mode: 'closed' })

  // 添加 CSS 樣式
  const style = document.createElement('style')

  // 先加載 CSS
  const css = await loadCSS()
  const shadowCSS = extractShadowCSS(css, '.konnyaku-floating-button-shadow-css')
  style.textContent = shadowCSS

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

  button.addEventListener('click', (e) => {
    e.stopPropagation()
    translateSelectedText()
  })

  shadow.appendChild(style)
  shadow.appendChild(button)

  return container
}

async function createTranslationPopup() {
  // 創建容器元素
  const container = document.createElement('div')
  container.id = 'konnyaku-translation-container'
  container.className = 'konnyaku-translation-container'

  // 創建 Shadow DOM
  const shadow = container.attachShadow({ mode: 'closed' })

  // 添加 CSS 樣式
  const style = document.createElement('style')

  // 先加載 CSS
  const css = await loadCSS()
  const shadowCSS = extractShadowCSS(css, '.konnyaku-translation-popup-shadow-css')
  style.textContent = shadowCSS

  // 創建彈出窗口內容
  const popup = document.createElement('div')
  popup.className = 'popup'

  shadow.appendChild(style)
  shadow.appendChild(popup)

  // 保存引用以便後續使用
  container.popupElement = popup
  container.shadowRoot = shadow

  return container
}

async function showFloatingButton() {
  if (!floatingButtonContainer) {
    floatingButtonContainer = await createFloatingButton()
    document.body.appendChild(floatingButtonContainer)
  }

  // 使用滑鼠位置而不是選取範圍位置
  floatingButtonContainer.style.left = `${lastMousePosition.x - 18}px`
  floatingButtonContainer.style.top = `${lastMousePosition.y - 36 - 8}px`
  floatingButtonContainer.style.display = 'block'
}

function hideFloatingButton() {
  if (floatingButtonContainer) {
    floatingButtonContainer.style.display = 'none'
  }
}

function hideTranslationPopup() {
  if (translationPopupContainer) {
    translationPopupContainer.remove()
    translationPopupContainer = null
  }
}

async function translateSelectedText() {
  const selectedText = window.getSelection().toString().trim()

  if (!selectedText) return

  // 初始化 i18n
  if (!i18n) {
    i18n = await getContentI18n()
  }

  if (!translationPopupContainer) {
    translationPopupContainer = await createTranslationPopup()
    document.body.appendChild(translationPopupContainer)
  }

  translationPopupContainer.style.left = `${lastMousePosition.x}px`
  translationPopupContainer.style.top = `${lastMousePosition.y + 10}px`

  // 獲取當前設定的語言
  const storage = await chrome.storage.local.get(['targetLanguage', 'preferredLanguages'])
  const preferredLanguages = storage.preferredLanguages || []
  const currentLang = storage.targetLanguage || 'zh-TW'

  // 定義所有可用語言
  const allLanguages = [
    { code: 'zh-TW', name: i18n.t('languages.zh-TW') },
    { code: 'zh-CN', name: i18n.t('languages.zh-CN') },
    { code: 'ja', name: i18n.t('languages.ja') },
    { code: 'ko', name: i18n.t('languages.ko') },
    { code: 'en', name: i18n.t('languages.en') },
    { code: 'es', name: i18n.t('languages.es') },
    { code: 'fr', name: i18n.t('languages.fr') },
    { code: 'de', name: i18n.t('languages.de') },
    { code: 'it', name: i18n.t('languages.it') },
    { code: 'pt', name: i18n.t('languages.pt') },
    { code: 'ru', name: i18n.t('languages.ru') },
    { code: 'ar', name: i18n.t('languages.ar') },
    { code: 'hi', name: i18n.t('languages.hi') },
    { code: 'th', name: i18n.t('languages.th') },
    { code: 'vi', name: i18n.t('languages.vi') }
  ]

  // 過濾語言選項基於用戶偏好，如果沒有設置偏好則顯示所有語言
  const filteredLanguages =
    preferredLanguages.length > 0 ? allLanguages.filter((lang) => preferredLanguages.includes(lang.code)) : allLanguages

  // 生成語言選項
  const languageOptions = filteredLanguages
    .map((lang) => `<option value="${lang.code}" ${currentLang === lang.code ? 'selected' : ''}>${lang.name}</option>`)
    .join('')

  // 獲取彈出窗口元素
  const popup = translationPopupContainer.popupElement

  popup.innerHTML = `
    <div class="header">
      <div class="flex">
        <img src="${chrome.runtime.getURL('icon.png')}" alt="Konnyaku">
        <select class="language-selector" id="language-selector">
          ${languageOptions}
        </select>
      </div>
      <button class="settings-btn" id="settings-btn">
        <svg class="lucide lucide-settings2-icon lucide-settings-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 17H5"/><path d="M19 7h-9"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
      </button>
    </div>
    <div class="translation-content">
      <div class="loading">
        <svg class="animate-spin" style="width: 24px; height: 24px; color: #2563eb;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle style="opacity: 0.25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path style="opacity: 0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>${i18n.t('translating')}</span>
      </div>
    </div>
  `

  // 語言選擇器事件監聽
  const languageSelector = popup.querySelector('#language-selector')
  if (languageSelector) {
    languageSelector.addEventListener('change', async (e) => {
      const newLang = e.target.value
      await chrome.storage.local.set({ targetLanguage: newLang })

      // 重新翻譯
      const translationContent = popup.querySelector('.translation-content')
      translationContent.innerHTML = `
        <div class="loading">
          <svg class="animate-spin" style="width: 24px; height: 24px; color: #2563eb;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle style="opacity: 0.25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path style="opacity: 0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>${i18n.t('translating')}</span>
        </div>
      `

      performTranslation(selectedText, translationContent)
    })
  }

  // 設定按鈕事件監聽 - 修復版本
  const settingsBtn = popup.querySelector('#settings-btn')
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      // 發送消息給 background script 來開啟選項頁面
      chrome.runtime.sendMessage({ action: 'openOptionsPage' }).catch((error) => {
        console.error('Error opening options page:', error)
      })
    })
  }

  const translationContent = popup.querySelector('.translation-content')
  await performTranslation(selectedText, translationContent)

  hideFloatingButton()
}

async function performTranslation(text, contentElement) {
  // 確保 i18n 已初始化
  if (!i18n) {
    i18n = await getContentI18n()
  }

  try {
    const response = await chrome.runtime.sendMessage({
      action: 'translate',
      text: text
    })

    if (response.error) {
      contentElement.innerHTML = `
        <div class="error">
          <strong>${i18n.t('error')}</strong> ${response.error}
        </div>
      `
    } else {
      contentElement.innerHTML = `
        <div class="translation-result">
          <div class="translation-text">${response.translation}</div>
        </div>
      `
    }
  } catch (err) {
    console.error('Translation error:', err)
    contentElement.innerHTML = `
      <div class="error">${i18n.t('failedToTranslate')}</div>
    `
  }
}

// 全域事件監聽器

document.addEventListener('mouseup', (e) => {
  lastMousePosition = { x: e.clientX + window.scrollX, y: e.clientY + window.scrollY }
  setTimeout(() => {
    const selection = window.getSelection()
    const selectedText = selection.toString().trim()

    if (selectedText && selectedText.length > 0) {
      showFloatingButton()
    } else {
      hideFloatingButton()
    }
  }, 10)
})

document.addEventListener('mousedown', (e) => {
  // 檢查是否點擊在浮動按鈕內
  if (floatingButtonContainer && !floatingButtonContainer.contains(e.target)) {
    hideFloatingButton()
  }
  // 檢查是否點擊在翻譯彈出窗內
  if (translationPopupContainer && !translationPopupContainer.contains(e.target)) {
    hideTranslationPopup()
  }
})

document.addEventListener('selectionchange', () => {
  const selectedText = window.getSelection().toString().trim()
  if (!selectedText) {
    hideFloatingButton()
  }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSelectedText') {
    const selectedText = window.getSelection().toString().trim()
    sendResponse({ selectedText })
  }
  return true
})
