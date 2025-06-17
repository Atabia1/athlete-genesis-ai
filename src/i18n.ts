
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Default translations since JSON files are not available
const enCommon = {
  welcome: "Welcome",
  login: "Login",
  logout: "Logout"
};

const twCommon = {
  welcome: "歡迎",
  login: "登入", 
  logout: "登出"
};

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
