import * as React from 'react';
import classnames from 'classnames';
import { PlaceholderProps } from './StorybookComponents.types';
import styles from './styles.scss';

const Placeholder: React.FC<PlaceholderProps> = ({
  skin,
  children,
  ...rest
}) => {
  return (
    <div
      style={{ ...rest }}
      className={classnames(styles.root, {
        [styles.light]: skin === 'light',
        [styles.dark]: skin === 'dark',
      })}
    >
      {children}
    </div>
  );
};

Placeholder.defaultProps = {
  skin: 'dark',
};

export default { Placeholder };