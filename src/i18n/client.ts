import { defaultLang, supportedLangs, translations, type Lang } from './translations';

const storageKey = 'bds-lang';
const contactEndpoint =
  ((import.meta.env.PUBLIC_CONTACT_ENDPOINT as string | undefined)?.trim() || '/api/contact');
const calLink = 'nicolas-oliva-velez-iehecs/hablemos-de-tu-proyecto';
const calOrigin = 'https://cal.com';
const calNamespace = 'boutiqueDigitalStudio';

type CalApi = ((...args: unknown[]) => void) & {
  loaded?: boolean;
  ns?: Record<string, CalApi>;
  q?: unknown[];
};

declare global {
  interface Window {
    Cal?: CalApi;
  }
}

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
  document.documentElement.dataset.activeLang = lang;
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

  document.querySelectorAll<HTMLAnchorElement>('[data-whatsapp-link]').forEach((node) => {
    node.href = `https://wa.me/5491132102111?text=${encodeURIComponent(dictionary.whatsappMessage)}`;
  });

  document.querySelectorAll<HTMLElement>('[data-hero-loop]').forEach((node) => {
    const firstKey = node.dataset.loopKeys?.split(',')[0] as keyof typeof dictionary | undefined;
    if (firstKey && dictionary[firstKey]) node.textContent = dictionary[firstKey];
  });

  document.documentElement.classList.add('i18n-ready');
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
  const activeScrollLocks = new Set<string>();
  let scrollY = 0;

  const setScrollLock = (key: string, isLocked: boolean) => {
    const wasLocked = activeScrollLocks.size > 0;

    if (isLocked) {
      activeScrollLocks.add(key);
    } else {
      activeScrollLocks.delete(key);
    }

    const shouldLock = activeScrollLocks.size > 0;

    if (!wasLocked && shouldLock) {
      scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    }

    if (wasLocked && !shouldLock) {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    }
  };

  const setMenuOpen = (isOpen: boolean) => {
    if (!menuToggle || !overlay) return;
    const isCurrentlyOpen = document.body.classList.contains('menu-open');
    if (isCurrentlyOpen === isOpen) return;
    setScrollLock('menu', isOpen);
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

  const getSolutionBody = (detail: HTMLDetailsElement) =>
    detail.querySelector<HTMLElement>('[data-solution-body]');

  const expandSolution = (detail: HTMLDetailsElement) => {
    const body = getSolutionBody(detail);
    if (!body) return;
    detail.classList.remove('is-closing');
    detail.open = true;
    body.style.height = `${body.scrollHeight}px`;

    window.setTimeout(() => {
      if (detail.open && !detail.classList.contains('is-closing')) body.style.height = 'auto';
    }, 430);
  };

  const collapseSolution = (detail: HTMLDetailsElement) => {
    const body = getSolutionBody(detail);
    if (!body || !detail.open) return;
    body.style.height = `${body.scrollHeight}px`;
    detail.classList.add('is-closing');

    window.requestAnimationFrame(() => {
      body.style.height = '0px';
    });

    window.setTimeout(() => {
      detail.open = false;
      detail.classList.remove('is-closing');
      body.style.height = '';
    }, 430);
  };

  const openSolution = (detail: HTMLDetailsElement) => {
    expandSolution(detail);
    document.querySelectorAll<HTMLDetailsElement>('.solution-item[open]').forEach((other) => {
      if (other !== detail) collapseSolution(other);
    });
  };

  document.querySelectorAll<HTMLDetailsElement>('.solution-item').forEach((detail) => {
    const summary = detail.querySelector('summary');

    summary?.addEventListener('click', (event) => {
      event.preventDefault();
      if (detail.open && !detail.classList.contains('is-closing')) {
        collapseSolution(detail);
      } else {
        openSolution(detail);
      }
    });

    detail.addEventListener('mouseenter', () => {
      if (!window.matchMedia('(hover: hover)').matches) return;
      openSolution(detail);
    });
  });

  const loopNode = document.querySelector<HTMLElement>('[data-hero-loop]');
  const loopKeys = loopNode?.dataset.loopKeys?.split(',') ?? [];
  let loopIndex = 0;

  if (loopNode && loopKeys.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.setInterval(() => {
      const lang = (document.documentElement.dataset.activeLang ?? initialLang) as Lang;
      const dictionary = translations[lang];
      loopIndex = (loopIndex + 1) % loopKeys.length;
      const key = loopKeys[loopIndex] as keyof typeof dictionary;
      loopNode.classList.add('is-changing');
      window.setTimeout(() => {
        if (dictionary[key]) loopNode.textContent = dictionary[key];
        loopNode.classList.remove('is-changing');
      }, 240);
    }, 2600);
  }

  const calModal = document.querySelector<HTMLElement>('[data-cal-modal]');
  const calInline = document.querySelector<HTMLElement>('[data-cal-inline]');
  let calEmbedReady = false;

  const callNamespacedCal = (...args: unknown[]) => {
    const cal = window.Cal;
    const namespacedCal = cal?.ns?.[calNamespace];
    if (namespacedCal) {
      namespacedCal(...args);
      return;
    }
    cal?.(...args);
  };

  const ensureCalEmbed = () => {
    if (calEmbedReady || !calInline) return;

    const initialize = (windowRef: Window, scriptSrc: string, initName: string) => {
      const doc = windowRef.document;
      const queueCall = (api: CalApi, args: unknown[]) => api.q?.push(args);

      windowRef.Cal =
        windowRef.Cal ||
        (function calEmbed() {
          const cal = windowRef.Cal as CalApi;
          const args = Array.from(arguments);

          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            const script = doc.createElement('script');
            script.src = scriptSrc;
            script.async = true;
            doc.head.appendChild(script);
            cal.loaded = true;
          }

          if (args[0] === initName) {
            const api = function namespacedEmbed() {
              queueCall(api as CalApi, arguments);
            } as CalApi;
            const namespace = args[1];
            api.q = api.q || [];
            if (typeof namespace === 'string') {
              cal.ns = cal.ns || {};
              cal.ns[namespace] = cal.ns[namespace] || api;
              queueCall(cal.ns[namespace], args);
              queueCall(cal, ['initNamespace', namespace]);
            } else {
              queueCall(cal, args);
            }
            return;
          }

          queueCall(cal, args);
        } as CalApi);
    };

    initialize(window, 'https://app.cal.com/embed/embed.js', 'init');
    window.Cal?.('init', calNamespace, { origin: calOrigin });
    callNamespacedCal('ui', {
      styles: {
        body: { background: '#ffffff' },
        eventTypeListItem: { background: '#ffffff' },
      },
      hideEventTypeDetails: false,
    });
    callNamespacedCal('preload', { calLink });
    callNamespacedCal('inline', {
      elementOrSelector: '#cal-modal-inline',
      calLink,
      config: {
        layout: 'month_view',
      },
    });

    calEmbedReady = true;
  };

  const setCalModalOpen = (isOpen: boolean) => {
    if (!calModal) return;
    const isCurrentlyOpen = calModal.classList.contains('is-open');
    if (isCurrentlyOpen === isOpen) return;

    if (isOpen) {
      ensureCalEmbed();
      setMenuOpen(false);
    } else {
      callNamespacedCal('closeModal');
    }

    setScrollLock('cal', isOpen);
    document.documentElement.classList.toggle('cal-modal-open', isOpen);
    document.body.classList.toggle('cal-modal-open', isOpen);
    calModal.classList.toggle('is-open', isOpen);
    calModal.setAttribute('aria-hidden', String(!isOpen));
  };

  document.querySelectorAll<HTMLElement>('[data-cal-open]').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      setCalModalOpen(true);
    });
  });

  document.querySelectorAll<HTMLElement>('[data-cal-close]').forEach((trigger) => {
    trigger.addEventListener('click', () => setCalModalOpen(false));
  });

  window.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    setCalModalOpen(false);
    setMenuOpen(false);
  });

  const contactForm = document.querySelector<HTMLFormElement>('[data-contact-form]');
  contactForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const dictionary = translations[(document.documentElement.dataset.activeLang ?? initialLang) as Lang];
    const submitButton = contactForm.querySelector<HTMLButtonElement>('[data-contact-submit]');
    const errorNode = contactForm.querySelector<HTMLElement>('[data-contact-error]');
    const formData = new FormData(contactForm);

    errorNode?.setAttribute('hidden', '');

    if (!contactEndpoint) {
      if (errorNode) {
        errorNode.textContent = dictionary.formConfigError;
        errorNode.removeAttribute('hidden');
      }
      return;
    }

    if (formData.get('_gotcha')) return;

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = dictionary.formSending;
    }

    try {
      const payload = Object.fromEntries(formData.entries());
      const response = await window.fetch(contactEndpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const detail = await response.text().catch(() => '');
        console.error('Contact form request failed', {
          status: response.status,
          detail: detail.slice(0, 240),
        });
        throw new Error('Contact form request failed');
      }

      contactForm.classList.add('is-sent');
      contactForm.querySelector<HTMLElement>('[data-contact-success]')?.removeAttribute('hidden');
      contactForm.reset();
    } catch (error) {
      console.error('Contact form request failed', error);
      if (errorNode) {
        errorNode.textContent = dictionary.formError;
        errorNode.removeAttribute('hidden');
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = dictionary.formSubmit;
      }
    }
  });

  const backToTop = document.querySelector<HTMLButtonElement>('[data-back-to-top]');
  let backToTopRaf = 0;

  const updateBackToTop = () => {
    if (!backToTop) return;
    const shouldShow = window.scrollY > Math.min(620, window.innerHeight * 0.72);
    backToTop.classList.toggle('is-visible', shouldShow);
  };

  const requestBackToTopUpdate = () => {
    if (backToTopRaf) return;
    backToTopRaf = window.requestAnimationFrame(() => {
      backToTopRaf = 0;
      updateBackToTop();
    });
  };

  const scrollToTopSmooth = () => {
    const startY = window.scrollY;
    const duration = 760;
    const startedAt = performance.now();

    const easeInOutCubic = (progress: number) =>
      progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    const step = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = easeInOutCubic(progress);
      window.scrollTo(0, Math.max(0, startY * (1 - eased)));
      if (progress < 1) window.requestAnimationFrame(step);
    };

    window.requestAnimationFrame(step);
  };

  updateBackToTop();
  window.addEventListener('scroll', requestBackToTopUpdate, { passive: true });
  window.addEventListener('resize', requestBackToTopUpdate);
  backToTop?.addEventListener('click', scrollToTopSmooth);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initI18n, { once: true });
} else {
  initI18n();
}
