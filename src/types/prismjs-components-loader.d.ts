declare module 'prismjs-components-loader' {
  import type Prism from 'prismjs';

  type PrismComponentFactory = (prism: typeof Prism) => void;
  type PrismComponentsIndex = Record<string, PrismComponentFactory>;

  export default class PrismLoader {
    constructor(componentsIndex: PrismComponentsIndex);
    load(prism: typeof Prism, componentId: string): void;
  }
}

declare module 'prismjs-components-loader/lib/all-components' {
  import type Prism from 'prismjs';

  type PrismComponentFactory = (prism: typeof Prism) => void;
  type PrismComponentsIndex = Record<string, PrismComponentFactory>;

  const components: PrismComponentsIndex;
  export default components;
}
