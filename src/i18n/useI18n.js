import { ref, computed, onMounted } from 'vue'
import { locales, detectUserLocale, supportedLocales } from './locales.js'

export function useI18n() {
  const currentLocale = ref(detectUserLocale())
  const isLoading = ref(true)

  onMounted(async () => {
    try {
      const storage = await chrome.storage.local.get(['uiLanguage'])
      if (storage.uiLanguage && supportedLocales.includes(storage.uiLanguage)) {
        currentLocale.value = storage.uiLanguage
      }
    } catch (error) {
      console.error('Failed to load UI language:', error)
    } finally {
      isLoading.value = false
    }
  })

  const t = (path) => {
    const locale = currentLocale.value
    const translations = locales[locale] || locales.en
    
    const keys = path.split('.')
    let value = translations

    for (const key of keys) {
      value = value?.[key]
      if (value === undefined) {
        const fallback = locales.en
        let fallbackValue = fallback
        for (const k of keys) {
          fallbackValue = fallbackValue?.[k]
        }
        return fallbackValue || path
      }
    }

    return value
  }

  const setLocale = async (locale) => {
    if (supportedLocales.includes(locale)) {
      currentLocale.value = locale
      try {
        await chrome.storage.local.set({ uiLanguage: locale })
      } catch (error) {
        console.error('Failed to save UI language:', error)
      }
    }
  }

  return {
    t,
    locale: currentLocale,
    setLocale,
    supportedLocales,
    isLoading
  }
}
