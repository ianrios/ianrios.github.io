export {};

declare module 'react' {
  // Allow CSS custom properties in React's style objects
  type CSSPropertiesExtended = Record<
    `--${string}`,
    string | number | undefined
  >;
  interface CSSProperties extends CSSPropertiesExtended {}
}
