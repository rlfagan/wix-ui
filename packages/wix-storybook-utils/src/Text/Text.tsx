import React from 'react';

import { classes, st } from './Text.st.css';

export type TextProps = {
  size?: 'tiny' | 'small' | 'medium';
  weight?: 'thin' | 'normal' | 'bold';
  secondary?: boolean;
  light?: boolean;
  children?: React.ReactNode;
  className?: string;
  as?: 'span' | 'p';
};

const Text: React.FC<TextProps> = ({
  size,
  weight,
  secondary,
  light,
  children,
  className,
  as,
}) =>
  React.createElement(as, {
    className: st(classes.root, { size, weight, secondary, light }, className),
    children,
  });

Text.defaultProps = {
  as: 'p',
  size: 'medium',
  weight: 'thin',
};

Text.displayName = 'Text';

export default Text;
