declare module '*.scss'
declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module 'signal-exit' {
  export default function onExit(cb: () => void): void;
}
