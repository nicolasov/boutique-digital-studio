# Boutique Digital Studio visual system

Derived from the supplied references: blit.studio, Basic Agency, Bureau Borsche, Locomotive, Apple, and Awwwards editorial agency sites.

## Tokens

```css
:root {
  --bg: oklch(99% 0.001 95);
  --surface: oklch(100% 0 0);
  --fg: oklch(14% 0.006 250);
  --muted: oklch(48% 0.006 250);
  --border: oklch(88% 0.004 250);
  --accent: oklch(24% 0.008 250);

  --font-display: "Iowan Old Style", "Canela", "Editorial New", Georgia, serif;
  --font-body: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
  --font-mono: "SF Mono", "IBM Plex Mono", ui-monospace, Menlo, monospace;
}
```

## Layout posture

- White editorial canvas with black ink, thin borders, and large negative space.
- Typography leads the experience: oversized serif moments paired with precise sans-serif body copy.
- Low radius: 0-8px for UI, mostly square media and panels.
- Accent budget is almost monochrome; use motion, crop, contrast, and spacing instead of color.
- Imagery should feel art-directed: high-contrast editorial crops, grayscale treatment, and WebGL-like distortion on hover or scroll.
