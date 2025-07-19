/**
 * CSS 載入和處理模組
 * 負責載入外部 CSS 檔案並提取 Shadow DOM 所需的樣式
 */

let cssTextCache = null

/**
 * 載入外部 CSS 檔案
 * @returns {Promise<string>} 返回 CSS 文字內容
 */
export async function loadCSS() {
  if (cssTextCache) return cssTextCache

  try {
    const response = await fetch(chrome.runtime.getURL('src/content.css'))
    cssTextCache = await response.text()
    return cssTextCache
  } catch (error) {
    console.error('Failed to load CSS:', error)
    return ''
  }
}

/**
 * 從 CSS 文本中提取特定選擇器的 Shadow DOM 樣式
 * @param {string} cssText - 完整的 CSS 文本
 * @param {string} selector - 要提取的選擇器
 * @returns {string} 提取後的 CSS 樣式
 */
export function extractShadowCSS(cssText, selector) {
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
      // 計算大括號
      braceCount += (line.match(/{/g) || []).length
      braceCount -= (line.match(/}/g) || []).length

      // 替換選擇器
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

      // 如果大括號計數為0，表示該規則組結束
      if (braceCount === 0 && line.includes('}')) {
        inTargetSection = false
      }
    }
  }

  return result.join('\n')
}

/**
 * 為 Shadow DOM 載入並處理 CSS
 * @param {string} selector - CSS 選擇器
 * @returns {Promise<string>} 返回處理後的 CSS
 */
export async function loadShadowCSS(selector) {
  const css = await loadCSS()
  return extractShadowCSS(css, selector)
}