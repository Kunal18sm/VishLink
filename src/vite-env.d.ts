/// <reference types="vite/client" />

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

interface Window {
  Razorpay: any;
}

interface ImportMetaEnv {
  readonly VITE_RAZORPAY_KEY_ID?: string;
  readonly [key: string]: any;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
