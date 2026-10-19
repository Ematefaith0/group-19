/* ---------- 1. Light theme (default) ---------- */
:root {
  color-scheme: light;

  /* Surfaces */
  --theme-bg: #ffffff; /* page background */
  --theme-surface: #f6f7f9; /* cards, table header */
  --theme-surface-alt: #eceef2; /* striped rows, group rows */
  --theme-border: #d9dce3;

  /* Text */
  --theme-text: #14161a; /* main text */
  --theme-text-muted: #5b6270; /* secondary text, captions */
  --theme-text-inverse: #ffffff; /* text on accent backgrounds */

  /* Accent / interactive */
  --theme-accent: #3b5bdb;
  --theme-accent-hover: #2f49b0;
  --theme-focus-ring: #3b5bdb;

  /* Feedback */
  --theme-row-hover: #e7ebff; /* table row hover */
  --theme-no-results: #b42318;

  /* Shadows */
  --theme-shadow-card: 0 2px 8px rgba(20, 22, 26, 0.08);

  /* Non-colour tokens */
  --theme-font-body: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --theme-font-heading: var(--theme-font-body);
  --theme-radius-sm: 6px;
  --theme-radius-md: 12px;
  --theme-space-1: 0.25rem;
  --theme-space-2: 0.5rem;
  --theme-space-3: 1rem;
  --theme-space-4: 1.5rem;
  --theme-space-5: 2.5rem;
  --theme-transition: 0.2s ease;
}

/* ---------- 2. Dark theme: set by JS (data-theme="dark") ---------- */
:root[data-theme="dark"] {
  color-scheme: dark;

  --theme-bg: #0e1116;
  --theme-surface: #171b22;
  --theme-surface-alt: #1f242d;
  --theme-border: #2b313c;

  --theme-text: #eef0f4;
  --theme-text-muted: #9aa3b2;
  --theme-text-inverse: #0e1116;

  --theme-accent: #7c93ff;
  --theme-accent-hover: #9fb0ff;
  --theme-focus-ring: #9fb0ff;

  --theme-row-hover: #232a3a;
  --theme-no-results: #ff8a80;

  --theme-shadow-card: 0 2px 10px rgba(0, 0, 0, 0.5);
}

/* ---------- 3. First visit: follow the OS setting ---------- Only applies when JS hasn't set data-theme yet. */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    color-scheme: dark;

    --theme-bg: #0e1116;
    --theme-surface: #171b22;
    --theme-surface-alt: #1f242d;
    --theme-border: #2b313c;

    --theme-text: #eef0f4;
    --theme-text-muted: #9aa3b2;
    --theme-text-inverse: #0e1116;

    --theme-accent: #7c93ff;
    --theme-accent-hover: #9fb0ff;
    --theme-focus-ring: #9fb0ff;

    --theme-row-hover: #232a3a;
    --theme-no-results: #ff8a80;

    --theme-shadow-card: 0 2px 10px rgba(0, 0, 0, 0.5);
  }
}

/* ---------- 4. Base styles that USE the tokens ---------- Everyone else's CSS should use var(--...) instead of raw colours. */
body {
  margin: 0;
  background-color: var(--theme-bg);
  color: var(--theme-text);
  font-family: var(--theme-font-body);
  line-height: 1.6;
  transition: background-color var(--theme-transition), color var(--theme-transition);
}

h1,
h2,
h3 {
  font-family: var(--theme-font-heading);
  color: var(--theme-text);
}

a {
  color: var(--theme-accent);
}

a:hover {
  color: var(--theme-accent-hover);
}

/* Smooth colour change when toggling, but respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
  }
}
