/**
 * Google tag (gtag.js) plugin
 * Ensures gtag is available globally and initializes dataLayer if not already present
 *
 * Note: The gtag.js scripts are now added during SSR via app.vue useHead()
 * so they're in the initial HTML for detection. This plugin just ensures
 * the gtag function is available globally for use in components.
 *
 * @see https://developers.google.com/tag-platform/gtagjs
 */
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const googleTagId = config.public.googleTagId;

  // Only load if Google Tag ID is configured
  if (!googleTagId) {
    return;
  }

  // Initialize dataLayer if not already present (should be from SSR script)
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];

    // Ensure gtag function is available globally
    // It should already be defined by the SSR script, but ensure it exists
    if (typeof window.gtag === 'undefined') {
      function gtag(...args: unknown[]) {
        window.dataLayer.push(args);
      }
      window.gtag = gtag;
    }
  }
});

// Extend Window interface for TypeScript
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}
