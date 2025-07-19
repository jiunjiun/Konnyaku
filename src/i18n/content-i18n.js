/**
 * Content Script 專用的簡化版國際化模組
 * 提供多語言支援功能
 */

/**
 * Content Script 的語言資源定義
 * @constant {Object.<string, Object>}
 */
const contentLocales = {
  en: {
    translating: 'Translating...',
    error: 'Error:',
    failedToTranslate: 'Failed to translate text',
    playAudio: 'Play audio',
    audioGenerationFailed: 'Failed to generate audio',
    audioPlaybackFailed: 'Failed to play audio',
    languages: {
      'zh-TW': 'Traditional Chinese',
      'zh-CN': 'Simplified Chinese',
      'ja': 'Japanese',
      'ko': 'Korean',
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'ar': 'Arabic',
      'hi': 'Hindi',
      'th': 'Thai',
      'vi': 'Vietnamese'
    }
  },
  'zh-TW': {
    translating: '翻譯中...',
    error: '錯誤：',
    failedToTranslate: '翻譯失敗',
    playAudio: '播放音訊',
    audioGenerationFailed: '音訊生成失敗',
    audioPlaybackFailed: '音訊播放失敗',
    languages: {
      'zh-TW': '繁體中文',
      'zh-CN': '簡體中文',
      'ja': '日文',
      'ko': '韓文',
      'en': '英文',
      'es': '西班牙文',
      'fr': '法文',
      'de': '德文',
      'it': '義大利文',
      'pt': '葡萄牙文',
      'ru': '俄文',
      'ar': '阿拉伯文',
      'hi': '印地文',
      'th': '泰文',
      'vi': '越南文'
    }
  },
  'zh-CN': {
    translating: '翻译中...',
    error: '错误：',
    failedToTranslate: '翻译失败',
    playAudio: '播放音频',
    audioGenerationFailed: '音频生成失败',
    audioPlaybackFailed: '音频播放失败',
    languages: {
      'zh-TW': '繁体中文',
      'zh-CN': '简体中文',
      'ja': '日文',
      'ko': '韩文',
      'en': '英文',
      'es': '西班牙文',
      'fr': '法文',
      'de': '德文',
      'it': '意大利文',
      'pt': '葡萄牙文',
      'ru': '俄文',
      'ar': '阿拉伯文',
      'hi': '印地文',
      'th': '泰文',
      'vi': '越南文'
    }
  },
  ja: {
    translating: '翻訳中...',
    error: 'エラー：',
    failedToTranslate: '翻訳に失敗しました',
    playAudio: '音声を再生',
    audioGenerationFailed: '音声生成に失敗しました',
    audioPlaybackFailed: '音声再生に失敗しました',
    languages: {
      'zh-TW': '繁体字中国語',
      'zh-CN': '簡体字中国語',
      'ja': '日本語',
      'ko': '韓国語',
      'en': '英語',
      'es': 'スペイン語',
      'fr': 'フランス語',
      'de': 'ドイツ語',
      'it': 'イタリア語',
      'pt': 'ポルトガル語',
      'ru': 'ロシア語',
      'ar': 'アラビア語',
      'hi': 'ヒンディー語',
      'th': 'タイ語',
      'vi': 'ベトナム語'
    }
  },
  ko: {
    translating: '번역 중...',
    error: '오류:',
    failedToTranslate: '번역 실패',
    playAudio: '오디오 재생',
    audioGenerationFailed: '오디오 생성 실패',
    audioPlaybackFailed: '오디오 재생 실패',
    languages: {
      'zh-TW': '번체 중국어',
      'zh-CN': '간체 중국어',
      'ja': '일본어',
      'ko': '한국어',
      'en': '영어',
      'es': '스페인어',
      'fr': '프랑스어',
      'de': '독일어',
      'it': '이탈리아어',
      'pt': '포르투갈어',
      'ru': '러시아어',
      'ar': '아랍어',
      'hi': '힌디어',
      'th': '태국어',
      'vi': '베트남어'
    }
  }
}

/**
 * 取得 Content Script 的國際化實例
 * @returns {Promise<Object>} 國際化物件，包含 t 函數和當前語言
 * @returns {Function} .t - 翻譯函數，接受鍵值並返回對應的翻譯文字
 * @returns {string} .locale - 當前的語言代碼
 */
export async function getContentI18n() {
  try {
    const storage = await chrome.storage.local.get(['uiLanguage'])
    const locale = storage.uiLanguage || navigator.language.substring(0, 2)
    const translations = contentLocales[locale] || contentLocales.en
    
    return {
      t: (key) => {
        const keys = key.split('.')
        let value = translations
        for (const k of keys) {
          value = value?.[k]
          if (value === undefined) {
            return contentLocales.en[key] || key
          }
        }
        return value
      },
      locale
    }
  } catch (error) {
    console.error('載入 i18n 失敗：', error)
    return {
      t: (key) => contentLocales.en[key] || key,
      locale: 'en'
    }
  }
}