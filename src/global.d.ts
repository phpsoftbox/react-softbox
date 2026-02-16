declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.css' {
  const css: string;
  export default css;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare const process: {
  env: {
    NODE_ENV?: string;
  };
};
