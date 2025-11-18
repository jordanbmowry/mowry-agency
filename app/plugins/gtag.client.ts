/**
 * Google tag (gtag.js) plugin
 * Adds Google tag scripts to the head for Google Ads, Analytics, and other Google products
 * @see https://developers.google.com/tag-platform/gtagjs
 */
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const googleTagId = config.public.googleTagId;

  // Only load if Google Tag ID is configured
  if (!googleTagId) {
    return;
  }

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  }

  // Add the gtag.js script dynamically
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${googleTagId}`;
  document.head.appendChild(script1);

  // Add the inline configuration script
  const script2 = document.createElement('script');
  script2.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${googleTagId}');
  `;
  document.head.appendChild(script2);

  // Make gtag available globally for use in components
  window.gtag = gtag;
});

// Extend Window interface for TypeScript
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}
