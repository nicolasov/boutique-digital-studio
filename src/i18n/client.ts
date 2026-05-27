import { defaultLang, supportedLangs, translations, type Lang } from './translations';

const storageKey = 'bds-lang';

const isLang = (value: string | null): value is Lang =>
  Boolean(value && supportedLangs.includes(value as Lang));

const detectLang = (): Lang => {
  const stored = window.localStorage.getItem(storageKey);
  if (isLang(stored)) return stored;

  const browserLang = window.navigator.language.toLowerCase();
  return browserLang.startsWith('en') ? 'en' : defaultLang;
};

const applyLang = (lang: Lang) => {
  const dictionary = translations[lang];

  document.documentElement.lang = lang;
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((node) => {
    const key = node.dataset.i18n as keyof typeof dictionary;
    if (dictionary[key]) node.textContent = dictionary[key];
  });

  document.querySelectorAll<HTMLElement>('[data-lang-option]').forEach((node) => {
    const isActive = node.dataset.langOption === lang;
    node.setAttribute('aria-pressed', String(isActive));
    node.classList.toggle('is-active', isActive);
  });

  const title = dictionary.metaTitle;
  const description = dictionary.metaDescription;
  if (title) document.title = title;
  if (description) {
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
  }
};

const initI18n = () => {
  const initialLang = detectLang();
  applyLang(initialLang);

  document.querySelectorAll<HTMLButtonElement>('[data-lang-option]').forEach((button) => {
    button.addEventListener('click', () => {
      const lang = button.dataset.langOption;
      if (!isLang(lang ?? null)) return;
      window.localStorage.setItem(storageKey, lang);
      applyLang(lang);
    });
  });

  const menuToggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menuCloseButtons = document.querySelectorAll<HTMLElement>('[data-menu-close]');
  const overlay = document.querySelector<HTMLElement>('[data-menu-overlay]');

  const setMenuOpen = (isOpen: boolean) => {
    if (!menuToggle || !overlay) return;
    document.body.classList.toggle('menu-open', isOpen);
    overlay.classList.toggle('is-open', isOpen);
    overlay.setAttribute('aria-hidden', String(!isOpen));
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  };

  menuToggle?.addEventListener('click', () => {
    const isOpen = document.body.classList.contains('menu-open');
    setMenuOpen(!isOpen);
  });

  menuCloseButtons.forEach((button) => {
    button.addEventListener('click', () => setMenuOpen(false));
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenuOpen(false);
  });
};

initI18n();
