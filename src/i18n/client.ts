import { defaultLang, supportedLangs, translations, type Lang } from './translations';

const storageKey = 'bds-lang';

const isLang = (value: string | null): value is Lang =>
  Boolean(value && supportedLangs.includes(value as Lang));

const detectLang = (): Lang => {
  const stored = window.localStorage.getItem(storageKey);
  if (isLang(stored)) return stored;

  const locales = [window.navigator.language, ...window.navigator.languages].filter(Boolean);
  return locales.some((locale) => locale.toLowerCase().startsWith('es')) ? 'es' : defaultLang;
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

  const siteHeader = document.querySelector<HTMLElement>('[data-site-header]');
  const headerTrigger = document.querySelector<HTMLElement>('[data-header-trigger]');
  let headerRaf = 0;

  const updateHeaderVisibility = () => {
    if (!siteHeader) return;
    const headerHeight = siteHeader.offsetHeight || 76;
    const triggerTop = headerTrigger?.getBoundingClientRect().top ?? 0;
    const shouldShow = window.scrollY > 8 && triggerTop <= headerHeight;
    siteHeader.classList.toggle('is-visible', shouldShow);
  };

  const requestHeaderUpdate = () => {
    if (headerRaf) return;
    headerRaf = window.requestAnimationFrame(() => {
      headerRaf = 0;
      updateHeaderVisibility();
    });
  };

  updateHeaderVisibility();
  window.addEventListener('scroll', requestHeaderUpdate, { passive: true });
  window.addEventListener('resize', requestHeaderUpdate);

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
    document.documentElement.classList.toggle('menu-open', isOpen);
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initI18n, { once: true });
} else {
  initI18n();
}
