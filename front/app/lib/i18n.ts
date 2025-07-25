import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

i18next
  .use(Backend)
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    load: 'languageOnly',
    lowerCaseLng: true,
    returnObjects: true,
    supportedLngs: ['en'],
  })
  .then();

export function saveLanguage(language: string) {
  localStorage.setItem('language', language);
}

export function getLanguage(): string {
  return localStorage.getItem('language') || 'en';
}
