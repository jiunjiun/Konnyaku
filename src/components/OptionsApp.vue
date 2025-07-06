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

        <div v-if="saveStatus" class="text-sm" :class="saveStatus === 'success' ? 'text-green-600' : 'text-red-600'">
          {{ saveStatus === 'success' ? t('settings.saveSuccess') : t('settings.saveError') }}
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from '../i18n/useI18n.js'

const { t, locale, setLocale } = useI18n()

const apiKey = ref('')
const targetLanguage = ref('zh-TW')
const saveStatus = ref('')
const preferredLanguages = ref([])
const currentLocale = ref('')

const languageCodes = ['zh-TW', 'zh-CN', 'ja', 'ko', 'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ar', 'hi', 'th', 'vi']

// 使用 computed 來自動更新語言名稱
const availableLanguages = computed(() =>
  languageCodes.map(code => ({
    code,
    name: t(`languages.${code}`)
  }))
)

onMounted(async () => {
  const storage = await chrome.storage.local.get(['apiKey', 'targetLanguage', 'preferredLanguages', 'uiLanguage'])
  if (storage.apiKey) apiKey.value = storage.apiKey
  if (storage.targetLanguage) targetLanguage.value = storage.targetLanguage
  if (storage.preferredLanguages && storage.preferredLanguages.length > 0) {
    preferredLanguages.value = storage.preferredLanguages
  } else {
    // Default to showing all languages if no preferences set
    preferredLanguages.value = availableLanguages.map(lang => lang.code)
  }
  currentLocale.value = locale.value
})

const handleLocaleChange = async () => {
  await setLocale(currentLocale.value)
}

const saveSettings = async () => {
  // 確保 preferredLanguages 是一個普通陣列
  const preferredLanguagesArray = Array.isArray(preferredLanguages.value)
    ? [...preferredLanguages.value]
    : preferredLanguages.value
  try {
    await chrome.storage.local.set({
      apiKey: apiKey.value,
      preferredLanguages: preferredLanguagesArray
    })
    saveStatus.value = 'success'
    setTimeout(() => {
      saveStatus.value = ''
    }, 3000)
  } catch (error) {
    saveStatus.value = 'error'
    setTimeout(() => {
      saveStatus.value = ''
    }, 3000)
  }
}
</script>
