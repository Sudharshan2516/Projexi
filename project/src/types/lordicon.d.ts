/* Allow using <lord-icon> in TSX */
declare namespace JSX {
  interface IntrinsicElements {
    'lord-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      src?: string;
      trigger?: string;
      delay?: string | number;
      stroke?: string | number;
      colors?: string;
      target?: string;
      state?: string;
    };
  }
}
