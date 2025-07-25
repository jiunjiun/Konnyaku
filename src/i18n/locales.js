/**
 * 多語言資源定義模組
 * 包含所有支援語言的翻譯文字
 * 
 * 使用範例：
 * ```javascript
 * import { locales, getLocale } from './locales.js'
 * 
 * // 取得英文翻譯
 * const enTranslations = getLocale('en')
 * console.log(enTranslations.settings.title) // 'Konnyaku Settings'
 * 
 * // 取得特定語言的特定翻譯
 * const zhTwSettings = locales['zh-TW'].settings
 * console.log(zhTwSettings.saveButton) // '儲存設定'
 * ```
 */

import { LANGUAGE_NAMES_EN, SUPPORTED_UI_LANGUAGES, detectUserLanguage } from './language-constants.js'

/**
 * 語言資源物件
 * @constant {Object.<string, Object>}
 * 
 * 結構說明：
 * - settings: 設定頁面相關的翻譯文字
 *   - title: 頁面標題
 *   - apiKey: API 金鑰相關設定
 *   - targetLanguage: 目標語言設定
 *   - preferredLanguages: 偏好語言設定
 *   - saveButton: 儲存按鈕文字
 *   - saveSuccess/saveError: 儲存狀態訊息
 *   - uiLanguage: 介面語言設定
 * - languages: 各語言的本地化名稱
 */
export const locales = {
  en: {
    settings: {
      title: 'Konnyaku Settings',
      apiKey: {
        label: 'Gemini API Key',
        placeholder: 'Enter your Gemini API key',
        help: 'Get your API key from',
        helpLink: 'Google AI Studio'
      },
      targetLanguage: {
        label: 'Current Target Language',
        help: 'Change target language in the translation popup when translating text'
      },
      preferredLanguages: {
        label: 'Preferred Languages',
        help: 'Select which languages you want to see in the translation popup dropdown'
      },
      saveButton: 'Save Settings',
      saveSuccess: 'Settings saved successfully!',
      saveError: 'Failed to save settings',
      uiLanguage: {
        label: 'Interface Language'
      }
    },
    // 英文介面使用組合的語言名稱（包含原文）
    languages: {
      'zh-TW': 'Traditional Chinese (繁體中文)',
      'zh-CN': 'Simplified Chinese (简体中文)',
      'ja': 'Japanese (日本語)',
      'ko': 'Korean (한국어)',
      'en': 'English',
      'es': 'Spanish (Español)',
      'fr': 'French (Français)',
      'de': 'German (Deutsch)',
      'it': 'Italian (Italiano)',
      'pt': 'Portuguese (Português)',
      'ru': 'Russian (Русский)',
      'ar': 'Arabic (العربية)',
      'hi': 'Hindi (हिन्दी)',
      'th': 'Thai (ไทย)',
      'vi': 'Vietnamese (Tiếng Việt)'
    }
  },
  'zh-TW': {
    settings: {
      title: 'Konnyaku 設定',
      apiKey: {
        label: 'Gemini API 金鑰',
        placeholder: '輸入您的 Gemini API 金鑰',
        help: '從這裡取得您的 API 金鑰',
        helpLink: 'Google AI Studio'
      },
      targetLanguage: {
        label: '目前的目標語言',
        help: '在翻譯文字時，可在翻譯彈出視窗中更改目標語言'
      },
      preferredLanguages: {
        label: '偏好語言',
        help: '選擇您想在翻譯彈出視窗下拉選單中看到的語言'
      },
      saveButton: '儲存設定',
      saveSuccess: '設定已成功儲存！',
      saveError: '儲存設定失敗',
      uiLanguage: {
        label: '介面語言'
      }
    },
    languages: {
      'zh-TW': '繁體中文',
      'zh-CN': '簡體中文',
      'ja': '日文(日本語)',
      'ko': '韓文(한국어)',
      'en': '英文(English)',
      'es': '西班牙文(Español)',
      'fr': '法文(Français)',
      'de': '德文(Deutsch)',
      'it': '義大利文(Italiano)',
      'pt': '葡萄牙文(Português)',
      'ru': '俄文(Русский)',
      'ar': '阿拉伯文(العربية)',
      'hi': '印地文(हिन्दी)',
      'th': '泰文(ไทย)',
      'vi': '越南文(Tiếng Việt)'
    }
  },
  'zh-CN': {
    settings: {
      title: 'Konnyaku 设置',
      apiKey: {
        label: 'Gemini API 密钥',
        placeholder: '输入您的 Gemini API 密钥',
        help: '从这里获取您的 API 密钥',
        helpLink: 'Google AI Studio'
      },
      targetLanguage: {
        label: '当前目标语言',
        help: '在翻译文本时，可在翻译弹出窗口中更改目标语言'
      },
      preferredLanguages: {
        label: '首选语言',
        help: '选择您想在翻译弹出窗口下拉菜单中看到的语言'
      },
      saveButton: '保存设置',
      saveSuccess: '设置已成功保存！',
      saveError: '保存设置失败',
      uiLanguage: {
        label: '界面语言'
      }
    },
    languages: {
      'zh-TW': '繁体中文',
      'zh-CN': '简体中文',
      'ja': '日文(日本語)',
      'ko': '韩文(한국어)',
      'en': '英文(English)',
      'es': '西班牙文(Español)',
      'fr': '法文(Français)',
      'de': '德文(Deutsch)',
      'it': '意大利文(Italiano)',
      'pt': '葡萄牙文(Português)',
      'ru': '俄文(Русский)',
      'ar': '阿拉伯文(العربية)',
      'hi': '印地文(हिन्दी)',
      'th': '泰文(ไทย)',
      'vi': '越南文(Tiếng Việt)'
    }
  },
  ja: {
    settings: {
      title: 'Konnyaku 設定',
      apiKey: {
        label: 'Gemini API キー',
        placeholder: 'Gemini API キーを入力してください',
        help: 'API キーはこちらから取得できます',
        helpLink: 'Google AI Studio'
      },
      targetLanguage: {
        label: '現在の翻訳先言語',
        help: 'テキストを翻訳する際、翻訳ポップアップで翻訳先言語を変更できます'
      },
      preferredLanguages: {
        label: '優先言語',
        help: '翻訳ポップアップのドロップダウンに表示する言語を選択してください'
      },
      saveButton: '設定を保存',
      saveSuccess: '設定が正常に保存されました！',
      saveError: '設定の保存に失敗しました',
      uiLanguage: {
        label: 'インターフェース言語'
      }
    },
    languages: {
      'zh-TW': '繁体字中国語(繁體中文)',
      'zh-CN': '簡体字中国語(简体中文)',
      'ja': '日本語',
      'ko': '韓国語(한국어)',
      'en': '英語(English)',
      'es': 'スペイン語(Español)',
      'fr': 'フランス語(Français)',
      'de': 'ドイツ語(Deutsch)',
      'it': 'イタリア語(Italiano)',
      'pt': 'ポルトガル語(Português)',
      'ru': 'ロシア語(Русский)',
      'ar': 'アラビア語(العربية)',
      'hi': 'ヒンディー語(हिन्दी)',
      'th': 'タイ語(ไทย)',
      'vi': 'ベトナム語(Tiếng Việt)'
    }
  },
  ko: {
    settings: {
      title: 'Konnyaku 설정',
      apiKey: {
        label: 'Gemini API 키',
        placeholder: 'Gemini API 키를 입력하세요',
        help: '여기에서 API 키를 받으세요',
        helpLink: 'Google AI Studio'
      },
      targetLanguage: {
        label: '현재 대상 언어',
        help: '텍스트를 번역할 때 번역 팝업에서 대상 언어를 변경할 수 있습니다'
      },
      preferredLanguages: {
        label: '선호 언어',
        help: '번역 팝업 드롭다운에 표시할 언어를 선택하세요'
      },
      saveButton: '설정 저장',
      saveSuccess: '설정이 성공적으로 저장되었습니다!',
      saveError: '설정 저장 실패',
      uiLanguage: {
        label: '인터페이스 언어'
      }
    },
    languages: {
      'zh-TW': '번체 중국어(繁體中文)',
      'zh-CN': '간체 중국어(简体中文)',
      'ja': '일본어(日本語)',
      'ko': '한국어',
      'en': '영어(English)',
      'es': '스페인어(Español)',
      'fr': '프랑스어(Français)',
      'de': '독일어(Deutsch)',
      'it': '이탈리아어(Italiano)',
      'pt': '포르투갈어(Português)',
      'ru': '러시아어(Русский)',
      'ar': '아랍어(العربية)',
      'hi': '힌디어(हिन्दी)',
      'th': '태국어(ไทย)',
      'vi': '베트남어(Tiếng Việt)'
    }
  }
}

/**
 * 支援的介面語言代碼列表
 * @constant {string[]}
 * @deprecated 請使用 SUPPORTED_UI_LOCALES from language-constants.js
 */
export const supportedLocales = SUPPORTED_UI_LANGUAGES

// 重新匯出 detectUserLocale 函數以保持向後相容
// 重新匯出以保持向後相容
export { detectUserLanguage as detectUserLocale }

/**
 * 取得指定語言的資源物件
 * @param {string} locale - 語言代碼
 * @returns {Object} 語言資源物件
 * @example
 * const zhTwLocale = getLocale('zh-TW')
 * console.log(zhTwLocale.settings.title) // 'Konnyaku 設定'
 * 
 * // 當語言不存在時，返回英文
 * const unknownLocale = getLocale('unknown')
 * console.log(unknownLocale.settings.title) // 'Konnyaku Settings'
 */
export function getLocale(locale) {
  return locales[locale] || locales.en
}

/**
 * 使用指南：
 * 
 * 1. 在 Vue 組件中使用（透過 useI18n composable）:
 * ```vue
 * <script setup>
 * import { useI18n } from '@/i18n/useI18n'
 * const { t } = useI18n()
 * </script>
 * <template>
 *   <h1>{{ t('settings.title') }}</h1>
 * </template>
 * ```
 * 
 * 2. 在一般 JavaScript 中使用:
 * ```javascript
 * import { getLocale } from '@/i18n/locales'
 * const locale = getLocale('zh-TW')
 * console.log(locale.settings.saveButton) // '儲存設定'
 * ```
 * 
 * 3. 取得支援的語言列表:
 * ```javascript
 * import { SUPPORTED_UI_LOCALES } from '@/constants/language-constants'
 * console.log(SUPPORTED_UI_LOCALES) // ['en', 'zh-TW', 'zh-CN', 'ja', 'ko']
 * ```
 */
