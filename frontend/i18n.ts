import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import pt from './locales/pt.json';
import en from './locales/en.json';
import es from './locales/es.json';

i18n
.use(initReactI18next)
.init({
  compatibilityJSON: 'v4',

  resources: {
    pt: {
      translation: pt
    },
    en: {
      translation: en
    },
    es: {
      translation: es
    }
  },

  lng: 'pt',
  fallbackLng: 'pt',

  interpolation: {
    escapeValue: false
  }
});

<<<<<<< HEAD
export default i18n;
=======
export default i18n;
>>>>>>> 6c53f0bd9cf5e03109b7fb61d370ab7a4ea596ce
