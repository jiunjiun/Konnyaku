// Constants
const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta'
const MODEL_NAME = 'gemini-2.5-flash-lite-preview-06-17'
const DEFAULT_TARGET_LANGUAGE = 'zh-TW'

const LANGUAGE_MAP = {
  'zh-TW': 'Traditional Chinese',
  'zh-CN': 'Simplified Chinese',
  'ja': 'Japanese',
  'ko': 'Korean',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'ar': 'Arabic',
  'hi': 'Hindi',
  'th': 'Thai',
  'vi': 'Vietnamese',
  'en': 'English'
}

// Message handler
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const handlers = {
    'translate': () => handleTranslation(request.text).then(sendResponse),
    'openOptionsPage': () => handleOpenOptionsPage().then(sendResponse)
  }

  const handler = handlers[request.action]
  if (handler) {
    handler()
    return true // Keep the message channel open for async response
  }
})

// Handlers
async function handleTranslation(text) {
  try {
    if (!text || typeof text !== 'string') {
      return { error: 'Invalid text provided' }
    }

    const config = await getConfiguration()
    if (!config.apiKey) {
      return { error: 'API key not configured' }
    }

    const translation = await translateText(text, config)
    return { translation }
  } catch (error) {
    console.error('Translation error:', error)
    return { error: error.message || 'Translation failed' }
  }
}

async function handleOpenOptionsPage() {
  try {
    await chrome.runtime.openOptionsPage()
    return { success: true }
  } catch (error) {
    console.error('Error opening options page:', error)
    return { error: error.message }
  }
}

// Core functions
async function getConfiguration() {
  const storage = await chrome.storage.local.get(['apiKey', 'targetLanguage'])
  return {
    apiKey: storage.apiKey,
    targetLanguage: storage.targetLanguage || DEFAULT_TARGET_LANGUAGE
  }
}

async function translateText(text, config) {
  const prompt = buildTranslationPrompt(text, config.targetLanguage)
  const response = await callGeminiAPI(prompt, config.apiKey)
  return extractTranslation(response)
}

function buildTranslationPrompt(text, targetLanguageCode) {
  const targetLanguageName = getLanguageName(targetLanguageCode)
  return `Please translate the following text to ${targetLanguageName}(${targetLanguageCode}).
Auto-detect the source language.
Only provide the translation without any explanation or additional text.

Text to translate: "${text}"`
}

async function callGeminiAPI(prompt, apiKey) {
  const url = `${API_BASE_URL}/models/${MODEL_NAME}:generateContent?key=${apiKey}`
  
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
    throw new Error(`API error (${response.status}): ${errorText}`)
  }

  return response.json()
}

function extractTranslation(apiResponse) {
  const text = apiResponse?.candidates?.[0]?.content?.parts?.[0]?.text
  
  if (!text) {
    throw new Error('Invalid response from API: No translation found')
  }
  
  return text.trim()
}

function getLanguageName(code) {
  return LANGUAGE_MAP[code] || code
}