import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import transaction_zh from './locales/zh/translation.json'
import transaction_en from './locales/en/translation.json'

i18n.use(LanguageDetector).init({
  // we init with resources
  resources:{
    en: {
      translations: transaction_en
    },
    zh: {
      translations: transaction_zh
    },
  },
  fallbackLng: 'en',
  debug: false,

  // have a common namespace used around the full app
  ns: ['translations'],
  defaultNS: 'translations',

  interpolation: {
    escapeValue: false, // not needed for react!!
    prefix: '__',
    suffix: '__'
  },

  react: {
    wait: true,
    bindStore: false
  }
})

export default i18n
