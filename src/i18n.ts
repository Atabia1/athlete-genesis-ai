
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enCommon from '/public/locales/en/common.json';
import twCommon from '/public/locales/tw/common.json';

const resources = {
  en: {
    common: enCommon,
  },
  tw: {
    common: twCommon,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    debug: false,

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    ns: ['common'],
    defaultNS: 'common',
  });

export default i18n;
