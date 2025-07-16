declare module 'virtual:vite-info' {
  export const buildTime: string;
  export function getTimestamp(): string;
  export const pluginNames: string[];
  export const viteMode: string;
  export const viteCommand: string;
  export const viteConfigRoot: string;
}
