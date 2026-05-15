declare module 'prismjs-components-loader' {
  import type Prism from 'prismjs';

  type PrismComponentMeta = {
    title?: string;
    require?: string[];
    optional?: string[];
    modify?: string[];
    alias?: string | string[];
  };

  type PrismLoaderStatic = {
    MAP: Record<string, PrismComponentMeta>;
    LIST: string[];
    getDependencies: (definition: PrismComponentMeta, prism: typeof Prism) => string[];
    load(prism: typeof Prism, componentId: string): void;
  };

  const PrismLoader: PrismLoaderStatic;
  export default PrismLoader;
}
