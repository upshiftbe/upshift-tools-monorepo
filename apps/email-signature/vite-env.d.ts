/// <reference types="vite/client" />

declare module '*.css?url' {
  const url: string;
  export default url;
}

declare module '*.svg?raw' {
  const src: string;
  export default src;
}
