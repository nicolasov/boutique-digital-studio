import { defaultLang, supportedLangs, translations, type Lang } from './translations';

const storageKey = 'bds-lang';
const contactEndpoint =
  ((import.meta.env.PUBLIC_CONTACT_ENDPOINT as string | undefined)?.trim() || 'https://formspree.io/f/mnjrwddb');
const calLink = 'nicolas-oliva-velez-iehecs/hablemos-de-tu-proyecto';
const calOrigin = 'https://cal.com';
const calNamespace = 'boutiqueDigitalStudio';
const contactCopy = {
  es: {
    title: 'Hablemos.',
    text: 'Contanos qué necesitás construir, mejorar o automatizar. Puede ser una web, una identidad, contenido visual o una idea que todavía necesita forma.',
    submit: 'Enviar consulta',
  },
  en: {
    title: 'Let’s talk.',
    text: 'Tell us what you need to build, improve, or automate. It can be a website, an identity, visual content, or an idea that still needs shape.',
    submit: 'Send inquiry',
  },
} satisfies Record<Lang, { title: string; text: string; submit: string }>;

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

  document.querySelector<HTMLElement>('[data-contact-title]')?.replaceChildren(contactCopy[lang].title);
  document.querySelector<HTMLElement>('[data-contact-text]')?.replaceChildren(contactCopy[lang].text);
  document.querySelector<HTMLElement>('[data-contact-submit-label]')?.replaceChildren(contactCopy[lang].submit);

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

  const setMenuOpen = (isOpen: boolean) => {
    if (!menuToggle || !overlay) return;
    const isCurrentlyOpen = document.body.classList.contains('menu-open');
    if (isCurrentlyOpen === isOpen) return;
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
    body.style.height = '0px';
    detail.open = true;

    window.requestAnimationFrame(() => {
      body.style.height = `${body.scrollHeight}px`;
    });

    const onTransitionEnd = (event: TransitionEvent) => {
      if (event.target !== body || event.propertyName !== 'height') return;
      body.style.height = 'auto';
      body.removeEventListener('transitionend', onTransitionEnd);
    };

    body.addEventListener('transitionend', onTransitionEnd);
  };

  const collapseSolution = (detail: HTMLDetailsElement) => {
    const body = getSolutionBody(detail);
    if (!body || !detail.open) return;
    body.style.height = `${body.scrollHeight}px`;
    detail.classList.add('is-closing');

    window.requestAnimationFrame(() => {
      body.style.height = '0px';
    });

    const onTransitionEnd = (event: TransitionEvent) => {
      if (event.target !== body || event.propertyName !== 'height') return;
      detail.open = false;
      detail.classList.remove('is-closing');
      body.style.height = '';
      body.removeEventListener('transitionend', onTransitionEnd);
    };

    body.addEventListener('transitionend', onTransitionEnd);
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
  contactForm
    ?.querySelector<HTMLInputElement>('[data-contact-phone]')
    ?.addEventListener('input', (event) => {
      (event.currentTarget as HTMLInputElement).setCustomValidity('');
    });

  contactForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const dictionary = translations[(document.documentElement.dataset.activeLang ?? initialLang) as Lang];
    const submitButton = contactForm.querySelector<HTMLButtonElement>('[data-contact-submit]');
    const submitLabel = contactForm.querySelector<HTMLElement>('.contact-submit-label');
    const errorNode = contactForm.querySelector<HTMLElement>('[data-contact-error]');
    const phoneInput = contactForm.querySelector<HTMLInputElement>('[data-contact-phone]');
    const currentPageInput = contactForm.querySelector<HTMLInputElement>('[data-current-page]');
    const timestampInput = contactForm.querySelector<HTMLInputElement>('[data-timestamp]');
    const userAgentInput = contactForm.querySelector<HTMLInputElement>('[data-user-agent]');

    errorNode?.setAttribute('hidden', '');
    contactForm.classList.remove('is-error');

    if (phoneInput) {
      const phoneValue = phoneInput.value.trim();
      const relaxedPhonePattern = /^\+?[0-9\s().-]{6,24}$/;
      const digitCount = phoneValue.replace(/\D/g, '').length;
      const isValidPhone =
        !phoneValue || (relaxedPhonePattern.test(phoneValue) && digitCount >= 6 && digitCount <= 18);
      phoneInput.setCustomValidity(isValidPhone ? '' : dictionary.formPhoneError);
      if (!isValidPhone) {
        phoneInput.reportValidity();
        return;
      }
    }

    if (currentPageInput) currentPageInput.value = window.location.href;
    if (timestampInput) timestampInput.value = new Date().toISOString();
    if (userAgentInput) userAgentInput.value = window.navigator.userAgent;

    const formData = new FormData(contactForm);

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
      submitButton.setAttribute('aria-busy', 'true');
      if (submitLabel) submitLabel.textContent = dictionary.formSending;
    }
    contactForm.classList.add('is-sending');

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
      contactForm.classList.add('is-error');
    } finally {
      contactForm.classList.remove('is-sending');
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.removeAttribute('aria-busy');
        if (submitLabel) submitLabel.textContent = contactCopy[(document.documentElement.dataset.activeLang ?? initialLang) as Lang].submit;
      }
    }
  });

  const backToTop = document.querySelector<HTMLButtonElement>('[data-back-to-top]');
  let backToTopRaf = 0;

  const typewriter = document.querySelector<HTMLElement>('[data-typewriter]');
  if (typewriter && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const typewriterPrefix = typewriter.querySelector<HTMLElement>('[data-typewriter-prefix]');
    const typewriterTail = typewriter.querySelector<HTMLElement>('[data-typewriter-tail]');
    const phrasesByLang: Record<Lang, string[]> = {
      es: typewriter.dataset.typewriterPhrases?.split('|').filter(Boolean) ?? [],
      en: ['digital solutions.', 'more clarity for your clients.', 'systems that generate opportunities.'],
    };
    if (phrasesByLang.es.length > 1) {
      const renderTypewriterText = (value: string) => {
        if (!typewriterPrefix || !typewriterTail) {
          typewriter.textContent = value;
          return;
        }

        const tailMatch = value.match(/(\S+)$/);
        if (!tailMatch?.index) {
          typewriterPrefix.textContent = '';
          typewriterTail.textContent = value;
          return;
        }

        typewriterPrefix.textContent = value.slice(0, tailMatch.index);
        typewriterTail.textContent = tailMatch[0];
      };
      let phraseIndex = 0;
      const initialPhrase = typewriter.textContent?.trim() || phrasesByLang.es[0] || '';
      renderTypewriterText(initialPhrase);
      let characterIndex = initialPhrase.length;
      let isDeleting = false;

      const tick = () => {
        const lang = (document.documentElement.dataset.activeLang ?? initialLang) as Lang;
        const phrases = phrasesByLang[lang] ?? phrasesByLang.es;
        const phrase = phrases[phraseIndex] ?? '';
        typewriter.classList.remove('is-paused');

        if (isDeleting) {
          characterIndex = Math.max(0, characterIndex - 1);
        } else {
          characterIndex = Math.min(phrase.length, characterIndex + 1);
        }

        renderTypewriterText(phrase.slice(0, characterIndex));

        let delay = isDeleting ? 34 : 48;
        if (!isDeleting && characterIndex === phrase.length) {
          typewriter.classList.add('is-paused');
          isDeleting = true;
          delay = 10400;
        } else if (isDeleting && characterIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          delay = 520;
        }

        window.setTimeout(tick, delay);
      };

      window.setTimeout(tick, 720);
    }
  }

  const updateBackToTop = () => {
    if (!backToTop) return;
    const shouldShow = window.scrollY > Math.min(620, window.innerHeight * 0.72);
    const pageBottom = document.documentElement.scrollHeight;
    const footerHeight = document.querySelector<HTMLElement>('.site-footer')?.offsetHeight ?? 0;
    const isOverFooter = window.scrollY + window.innerHeight >= pageBottom - footerHeight + 24;
    backToTop.classList.toggle('is-visible', shouldShow);
    backToTop.classList.toggle('is-over-footer', isOverFooter);
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

  const initPremiumInteractionLayer = () => {
    const canUsePointerLayer =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canUsePointerLayer) return;

    const heroSection = document.querySelector<HTMLElement>('#top');
    const cursor = document.createElement('div');
    const cursorDot = document.createElement('span');
    const trailCanvas = document.createElement('canvas');
    const trailContext = trailCanvas.getContext('2d', { alpha: true });

    cursor.className = 'premium-cursor';
    cursorDot.className = 'premium-cursor__dot';
    trailCanvas.className = 'hero-cursor-trail';
    trailCanvas.setAttribute('aria-hidden', 'true');
    cursor.setAttribute('aria-hidden', 'true');
    cursor.appendChild(cursorDot);
    document.body.appendChild(cursor);
    heroSection?.appendChild(trailCanvas);
    document.documentElement.classList.add('has-premium-cursor');

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const rendered = { x: pointer.x, y: pointer.y };
    const trailPoints = Array.from({ length: 6 }, () => ({ x: pointer.x, y: pointer.y }));
    const magneticTargets = Array.from(
      document.querySelectorAll<HTMLElement>(
        '.hero-primary, .header-call-button, .menu-button, .main-nav-link, .menu-link',
      ),
    );
    let activeTarget: HTMLElement | null = null;
    let cursorState: 'default' | 'link' | 'cta' | 'menu' = 'default';
    let frame = 0;
    let isVisible = false;

    const setCursorState = (state: typeof cursorState) => {
      cursorState = state;
      cursor.dataset.cursorState = state;
    };

    const resizeTrail = () => {
      if (!heroSection || !trailContext) return;
      const rect = heroSection.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      trailCanvas.width = Math.max(1, Math.round(rect.width * dpr));
      trailCanvas.height = Math.max(1, Math.round(rect.height * dpr));
      trailCanvas.style.width = `${rect.width}px`;
      trailCanvas.style.height = `${rect.height}px`;
      trailContext.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const getTargetState = (target: HTMLElement): typeof cursorState => {
      if (target.matches('.menu-button, .menu-link')) return 'menu';
      if (target.matches('.btn, .header-call-button, .hero-primary')) return 'cta';
      return 'link';
    };

    const resetTarget = (target: HTMLElement | null) => {
      if (!target) return;
      target.classList.remove('is-magnetic');
      target.style.setProperty('--magnetic-x', '0px');
      target.style.setProperty('--magnetic-y', '0px');
    };

    magneticTargets.forEach((target) => {
      target.dataset.magnetic = 'true';
      target.addEventListener('pointerenter', () => {
        activeTarget = target;
        setCursorState(getTargetState(target));
        target.classList.add('is-magnetic');
      });
      target.addEventListener('pointerleave', () => {
        if (activeTarget === target) activeTarget = null;
        resetTarget(target);
        setCursorState('default');
      });
    });

    const handlePointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      if (!isVisible) {
        isVisible = true;
        cursor.classList.add('is-visible');
      }

      if (!activeTarget) return;
      const rect = activeTarget.getBoundingClientRect();
      const distanceX = event.clientX - (rect.left + rect.width / 2);
      const distanceY = event.clientY - (rect.top + rect.height / 2);
      const magnetX = Math.max(-10, Math.min(10, distanceX * 0.12));
      const magnetY = Math.max(-10, Math.min(10, distanceY * 0.12));
      activeTarget.style.setProperty('--magnetic-x', `${magnetX.toFixed(2)}px`);
      activeTarget.style.setProperty('--magnetic-y', `${magnetY.toFixed(2)}px`);
    };

    const handlePointerLeave = () => {
      isVisible = false;
      cursor.classList.remove('is-visible');
      resetTarget(activeTarget);
      activeTarget = null;
      setCursorState('default');
    };

    const drawTrail = () => {
      if (!heroSection || !trailContext) return;
      const rect = heroSection.getBoundingClientRect();
      const isHeroVisible = rect.bottom > 0 && rect.top < window.innerHeight;
      trailContext.clearRect(0, 0, rect.width, rect.height);
      if (!isHeroVisible) return;

      trailPoints[0].x += (pointer.x - rect.left - trailPoints[0].x) * 0.28;
      trailPoints[0].y += (pointer.y - rect.top - trailPoints[0].y) * 0.28;
      for (let index = 1; index < trailPoints.length; index += 1) {
        trailPoints[index].x += (trailPoints[index - 1].x - trailPoints[index].x) * 0.22;
        trailPoints[index].y += (trailPoints[index - 1].y - trailPoints[index].y) * 0.22;
      }

      trailContext.save();
      trailContext.lineCap = 'round';
      trailContext.lineJoin = 'round';
      for (let index = trailPoints.length - 1; index > 0; index -= 1) {
        const point = trailPoints[index];
        const next = trailPoints[index - 1];
        const alpha = (1 - index / trailPoints.length) * 0.16;
        trailContext.strokeStyle = `rgba(17, 17, 17, ${alpha})`;
        trailContext.lineWidth = Math.max(0.45, 1.7 - index * 0.1);
        trailContext.beginPath();
        trailContext.moveTo(point.x, point.y);
        trailContext.lineTo(next.x, next.y);
        trailContext.stroke();
      }
      trailContext.restore();
    };

    const render = () => {
      rendered.x += (pointer.x - rendered.x) * 0.68;
      rendered.y += (pointer.y - rendered.y) * 0.68;
      cursor.style.transform = `translate3d(${rendered.x.toFixed(2)}px, ${rendered.y.toFixed(2)}px, 0)`;
      drawTrail();
      frame = window.requestAnimationFrame(render);
    };

    setCursorState('default');
    resizeTrail();
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('blur', handlePointerLeave);
    window.addEventListener('resize', resizeTrail, { passive: true });
    frame = window.requestAnimationFrame(render);

    window.addEventListener('pagehide', () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('blur', handlePointerLeave);
      window.removeEventListener('resize', resizeTrail);
      resetTarget(activeTarget);
      cursor.remove();
      trailCanvas.remove();
      document.documentElement.classList.remove('has-premium-cursor');
    }, { once: true });
  };

  initPremiumInteractionLayer();

  const initGsapAnimations = async () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Marca JS activo — activa las reglas CSS de opacity:0 para revelar con GSAP
    document.documentElement.classList.add('js');

    try {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      gsap.registerPlugin(ScrollTrigger);

      const isMobile = window.innerWidth <= 768;
      const heroSection = document.querySelector<HTMLElement>('#top');
      const heroLines = Array.from(document.querySelectorAll<HTMLElement>('.hero-title-line-inner'));
      const heroSubtitle = document.querySelector<HTMLElement>('.hero-loop-line');
      const heroCta = document.querySelector<HTMLElement>('.hero-cta');
      const heroImage = document.querySelector<HTMLElement>('.hero-visual');
      const processIntro = document.querySelector<HTMLElement>('.process-intro');
      const processHeadingWords = Array.from(document.querySelectorAll<HTMLElement>('.process-heading-word'));
      const processIntroCopy = document.querySelector<HTMLElement>('.process-intro-copy');
      const genericReveal = Array.from(document.querySelectorAll<HTMLElement>('.scroll-reveal')).filter(
        (node) =>
          !node.classList.contains('process-step-row') &&
          !node.classList.contains('process-intro') &&
          !node.closest('#work'),
      );

      if (heroLines.length) {
        gsap.set(heroLines, { autoAlpha: 1 });
        gsap.from(heroLines, {
          y: isMobile ? 35 : 70,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.12,
        });
      }

      if (heroSubtitle) {
        gsap.set(heroSubtitle, { autoAlpha: 1 });
        gsap.from(heroSubtitle, {
          opacity: 0,
          y: isMobile ? 12 : 24,
          duration: 0.8,
          delay: 0.45,
          ease: 'power2.out',
        });
      }

      if (heroCta) {
        gsap.set(heroCta, { autoAlpha: 1 });
        gsap.from(heroCta, {
          opacity: 0,
          scale: 0.93,
          duration: 0.7,
          delay: 0.7,
          ease: 'back.out(1.4)',
        });
      }

      if (heroImage && heroSection) {
        gsap.to(heroImage, {
          y: isMobile ? -45 : -90,
          ease: 'none',
          scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      if (processIntro) {
        gsap.set(processIntro, { autoAlpha: 1 });
        if (processHeadingWords.length) {
          gsap.set(processHeadingWords, { y: '115%' });
          gsap.to(processHeadingWords, {
            y: '0%',
            duration: 1.15,
            ease: 'expo.out',
            stagger: 0.075,
            scrollTrigger: {
              trigger: processIntro,
              start: 'top 82%',
              once: true,
            },
          });
        }
        if (processIntroCopy) {
          gsap.from(processIntroCopy, {
            opacity: 0,
            y: isMobile ? 12 : 22,
            duration: 0.9,
            delay: 0.18,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: processIntro,
              start: 'top 78%',
              once: true,
            },
          });
        }
      }

      const workRows = Array.from(document.querySelectorAll<HTMLElement>('.work-row'));
      const workSection = document.querySelector<HTMLElement>('#work');
      if (workRows.length && workSection) {
        gsap.set(workRows, { autoAlpha: 1 });
        gsap.from(workRows, {
          opacity: 0,
          x: isMobile ? -18 : -35,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: workSection,
            start: 'top 75%',
            once: true,
          },
        });
      }

      ScrollTrigger.batch('.work-row', {
        start: 'top 90%',
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, { opacity: 1, duration: 0.01 });
        },
      });

      document.querySelectorAll<HTMLElement>('.work-image-wrap').forEach((wrap) => {
        const image = wrap.querySelector<HTMLElement>('.webgl-pixel-image');
        if (!image) return;
        gsap.to(image, {
          y: isMobile ? -22 : -45,
          ease: 'none',
          scrollTrigger: {
            trigger: wrap.closest('.work-row') ?? wrap,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });

      ScrollTrigger.batch('.process-card', {
        start: 'top 80%',
        once: true,
        onEnter: (batch) => {
          gsap.set(batch, { autoAlpha: 1 });
          gsap.from(batch, {
            opacity: 0,
            y: isMobile ? 22 : 45,
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.1,
          });
        },
      });

      if (genericReveal.length) {
        ScrollTrigger.batch(genericReveal, {
          start: 'top 86%',
          once: true,
          onEnter: (batch) => {
            gsap.set(batch, { autoAlpha: 1 });
            gsap.from(batch, {
              opacity: 0,
              y: isMobile ? 14 : 28,
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.08,
            });
          },
        });
      }

      if (siteHeader) {
        let isCompact = false;
        let stickyLeaveTimer = 0;
        const setHeaderCompact = (compact: boolean) => {
          if (compact === isCompact) return;
          isCompact = compact;
          window.clearTimeout(stickyLeaveTimer);
          if (compact) {
            siteHeader.classList.remove('is-sticky-leaving');
            siteHeader.classList.add('is-scrolled');
            return;
          }
          siteHeader.classList.add('is-sticky-leaving');
          siteHeader.classList.remove('is-scrolled');
          stickyLeaveTimer = window.setTimeout(() => {
            siteHeader.classList.remove('is-sticky-leaving');
          }, 340);
        };

        let navRaf = 0;
        const requestNavUpdate = () => {
          if (navRaf) return;
          navRaf = window.requestAnimationFrame(() => {
            navRaf = 0;
            setHeaderCompact(window.scrollY > 60);
          });
        };

        setHeaderCompact(window.scrollY > 60);
        window.addEventListener('scroll', requestNavUpdate, { passive: true });
        window.addEventListener('resize', requestNavUpdate);
      }

      window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
      ScrollTrigger.refresh();
    } catch (error) {
      console.error('GSAP animations failed to initialize', error);
      // Fallback: hacer visibles todos los elementos animados si GSAP falla
      document.querySelectorAll<HTMLElement>('.process-intro, .process-card, .work-row').forEach((el) => {
        el.style.opacity = '1';
      });
    }
  };

  void initGsapAnimations();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initI18n, { once: true });
} else {
  initI18n();
}
