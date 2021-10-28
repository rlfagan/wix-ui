import React from 'react';

import { classes, st } from './Heading.st.css';

export type HeadingProps = {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
  children?: React.ReactNode;
};

const Heading: React.FC<HeadingProps> = ({ as, children }) =>
  React.createElement(as, {
    className: st(classes.root, { as }),
    children,
  });

Heading.defaultProps = {
  as: 'h1',
};

Heading.displayName = 'Heading';

export default Heading;
