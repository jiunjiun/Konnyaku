<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-2xl mx-auto px-8 py-6 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img src="/icon.png" alt="Konnyaku Logo" class="size-12 rounded-xl">
          <h1 class="text-2xl font-bold text-gray-800">{{ t('settings.title') }}</h1>
        </div>
        <select
          v-model="currentLocale"
          @change="handleLocaleChange"
          class="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="en">English</option>
          <option value="zh-TW">繁體中文</option>
          <option value="zh-CN">简体中文</option>
          <option value="ja">日本語</option>
          <option value="ko">한국어</option>
        </select>
      </div>
    </header>

    <!-- Main Content -->
    <div class="max-w-2xl mx-auto p-8">

    <div class="bg-white shadow-md rounded-lg p-6">
      <div class="mb-6">
        <label for="apiKey" class="block text-sm font-medium text-gray-700 mb-2">
          {{ t('settings.apiKey.label') }}
        </label>
        <input
          id="apiKey"
          v-model="apiKey"
          type="password"
          :placeholder="t('settings.apiKey.placeholder')"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p class="mt-2 text-sm text-gray-600">
          {{ t('settings.apiKey.help') }}
          <a href="https://aistudio.google.com/app/apikey" target="_blank" class="text-blue-600 hover:underline">
            {{ t('settings.apiKey.helpLink') }}
          </a>
        </p>
      </div>

      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ t('settings.targetLanguage.label') }}
        </label>
        <div class="w-full px-4 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
          {{ availableLanguages.find(lang => lang.code === targetLanguage)?.name || 'Traditional Chinese (繁體中文)' }}
        </div>
        <p class="mt-2 text-sm text-gray-600">
          {{ t('settings.targetLanguage.help') }}
        </p>
      </div>

      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ t('settings.preferredLanguages.label') }}
        </label>
        <div class="grid grid-cols-2 gap-2">
          <label v-for="lang in availableLanguages" :key="lang.code" class="flex items-center">
            <input
              v-model="preferredLanguages"
              :value="lang.code"
              type="checkbox"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-700">{{ lang.name }}</span>
          </label>
        </div>
        <p class="mt-2 text-sm text-gray-600">
          {{ t('settings.preferredLanguages.help') }}
        </p>
      </div>

      <div class="flex items-center justify-between">
        <button
          @click="saveSettings"
          class="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition-colors"
        >
          {{ t('settings.saveButton') }}
        </button>

        <div v-if="statusMessage" class="text-sm" :class="saveStatus === 'success' ? 'text-green-600' : 'text-red-600'">
          {{ statusMessage }}
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
/**
 * Konnyaku 擴充功能設定頁面元件
 * 
 * 功能：
 * - 管理 Gemini API 金鑰
 * - 顯示目前的目標語言（只讀）
 * - 選擇偏好語言列表
 * - 切換介面語言
 * 
 * 註：目標語言只能在翻譯時即時更改，不能在設定頁面修改
 */
import { ref, onMounted, computed } from 'vue'
import { useI18n } from '../i18n/useI18n.js'
import { 
  SUPPORTED_LANGUAGES, 
  STORAGE_KEYS,
  API 
} from '../constants/index.js'

// === 國際化設定 ===
const { t, locale, setLocale } = useI18n()

// === 設定資料 ===
const apiKey = ref('')
const targetLanguage = ref(API.DEFAULT_TARGET_LANGUAGE)
const preferredLanguages = ref([])
const currentLocale = ref('')

// === UI 狀態 ===
const saveStatus = ref('') // 'success' | 'error' | ''
const isLoading = ref(false)
const errorMessage = ref('')

/**
 * 可用語言列表
 * 使用 computed 來自動更新語言名稱（當介面語言切換時）
 */
const availableLanguages = computed(() =>
  SUPPORTED_LANGUAGES.map(code => ({
    code,
    name: t(`languages.${code}`)
  }))
)

/**
 * 載入設定資料
 * 從 Chrome storage 讀取使用者的設定
 */
async function loadSettings() {
  isLoading.value = true
  try {
    const storage = await chrome.storage.local.get([
      STORAGE_KEYS.API_KEY,
      STORAGE_KEYS.TARGET_LANGUAGE,
      STORAGE_KEYS.PREFERRED_LANGUAGES,
      STORAGE_KEYS.UI_LANGUAGE
    ])
    
    // 載入 API 金鑰
    if (storage[STORAGE_KEYS.API_KEY]) {
      apiKey.value = storage[STORAGE_KEYS.API_KEY]
    }
    
    // 載入目標語言
    if (storage[STORAGE_KEYS.TARGET_LANGUAGE]) {
      targetLanguage.value = storage[STORAGE_KEYS.TARGET_LANGUAGE]
    }
    
    // 載入偏好語言
    if (storage[STORAGE_KEYS.PREFERRED_LANGUAGES] && storage[STORAGE_KEYS.PREFERRED_LANGUAGES].length > 0) {
      preferredLanguages.value = storage[STORAGE_KEYS.PREFERRED_LANGUAGES]
    } else {
      // 預設顯示所有語言
      preferredLanguages.value = SUPPORTED_LANGUAGES
    }
    
    // 載入介面語言
    currentLocale.value = locale.value
  } catch (error) {
    console.error('載入設定失敗：', error)
    errorMessage.value = '載入設定失敗，請重新整理頁面'
  } finally {
    isLoading.value = false
  }
}

// 元件掛載時載入設定
onMounted(loadSettings)

/**
 * 處理介面語言切換
 * 更新 i18n 設定並儲存到 Chrome storage
 */
const handleLocaleChange = async () => {
  try {
    await setLocale(currentLocale.value)
  } catch (error) {
    console.error('切換語言失敗：', error)
    // 如果失敗，恢復原本的值
    currentLocale.value = locale.value
  }
}

/**
 * 儲存設定
 * 將 API 金鑰和偏好語言儲存到 Chrome storage
 */
const saveSettings = async () => {
  // 清除之前的狀態
  saveStatus.value = ''
  errorMessage.value = ''
  
  // 驗證輸入
  if (!apiKey.value || apiKey.value.trim() === '') {
    errorMessage.value = '請輸入 API 金鑰'
    saveStatus.value = 'error'
    return
  }
  
  // 驗證至少選擇一個語言
  if (preferredLanguages.value.length === 0) {
    errorMessage.value = '請至少選擇一個偏好語言'
    saveStatus.value = 'error'
    return
  }
  
  // 確保 preferredLanguages 是一個普通陣列
  const preferredLanguagesArray = Array.isArray(preferredLanguages.value)
    ? [...preferredLanguages.value]
    : preferredLanguages.value
    
  try {
    await chrome.storage.local.set({
      [STORAGE_KEYS.API_KEY]: apiKey.value.trim(),
      [STORAGE_KEYS.PREFERRED_LANGUAGES]: preferredLanguagesArray
    })
    
    saveStatus.value = 'success'
    // 3 秒後清除成功訊息
    setTimeout(() => {
      if (saveStatus.value === 'success') {
        saveStatus.value = ''
      }
    }, 3000)
  } catch (error) {
    console.error('儲存設定失敗：', error)
    errorMessage.value = error.message || '儲存設定失敗，請稍後再試'
    saveStatus.value = 'error'
    
    // 5 秒後清除錯誤訊息
    setTimeout(() => {
      if (saveStatus.value === 'error') {
        saveStatus.value = ''
        errorMessage.value = ''
      }
    }, 5000)
  }
}

/**
 * 顯示狀態訊息
 * 根據儲存狀態顯示不同的訊息
 */
const statusMessage = computed(() => {
  if (saveStatus.value === 'success') {
    return t('settings.saveSuccess')
  } else if (saveStatus.value === 'error' && errorMessage.value) {
    return errorMessage.value
  } else if (saveStatus.value === 'error') {
    return t('settings.saveError')
  }
  return ''
})
</script>
