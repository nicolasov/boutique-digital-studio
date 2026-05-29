# Boutique Digital Studio

Primera versión de una landing page profesional para un estudio digital boutique.

Stack:

- Astro
- TypeScript
- Tailwind CSS
- Componentes reutilizables
- Preparado para deploy en Vercel

## PixelImageReveal

`src/components/PixelImageReveal.astro` crea una revelacion premium con Three.js y GSAP para imagenes de proyectos.

Uso recomendado: portfolio, proyectos, casos de estudio y filas visuales similares. Evitar en hero, navegacion, formularios y secciones puramente textuales.

Props disponibles: `intensity`, `speed`, `scale` y `triggerOnce`.

## Estructura

```text
/
├── public/
├── src/
│   ├── components/
│   ├── layouts/
│   └── pages/
│   └── styles/
└── package.json
```

## Comandos

```sh
npm install
npm run dev
```

| Command | Action |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
