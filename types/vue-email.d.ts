// Type declarations for @vue-email/components
// The package re-exports from individual @vue-email/* packages but TypeScript
// has trouble resolving the types. These declarations allow the imports to work.

declare module '@vue-email/components' {
  import type { Component } from 'vue';

  export const Body: Component;
  export const Button: Component;
  export const CodeBlock: Component;
  export const CodeInline: Component;
  export const Column: Component;
  export const Container: Component;
  export const Font: Component;
  export const Head: Component;
  export const Heading: Component;
  export const Hr: Component;
  export const Html: Component;
  export const Img: Component;
  export const Link: Component;
  export const Markdown: Component;
  export const Preview: Component;
  export const Row: Component;
  export const Section: Component;
  export const Tailwind: Component;
  export const Text: Component;
  export const Style: Component;
}

// Extend the Tailwind component props to accept partial config
declare module '@vue-email/tailwind' {
  import type { Component } from 'vue';

  export const Tailwind: Component;
}
