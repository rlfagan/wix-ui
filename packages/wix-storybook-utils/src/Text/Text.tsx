import React from 'react';

import { classes, st } from './Text.st.css';

export type TextProps = {
  size?: 'tiny' | 'small' | 'medium';
  weight?: 'thin' | 'normal' | 'bold';
  secondary?: boolean;
  light?: boolean;
  children?: React.ReactNode;
};

const Text: React.FC<TextProps> = ({
  size,
  weight,
  secondary,
  light,
  children,
}) => (
  <p className={st(classes.root, { size, weight, secondary, light })}>
    {children}
  </p>
);

Text.defaultProps = {
  size: 'medium',
  weight: 'thin',
};

Text.displayName = 'Text';

export default Text;
