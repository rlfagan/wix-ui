import React from 'react';
import { storiesOf } from '@storybook/react';
import Heading from '..';

const as = ['h1', 'h2', 'h3', 'h4', 'h5'] as const;

const tests = [
  ...as.map(value => ({
    it: `should render as=${value}`,
    props: {
      as: value,
      children: `Heading ${value}`,
    },
  })),
] as const;

tests.forEach(({ it, props }) => {
  storiesOf('Heading', module).add(it, () => <Heading {...props} />);
});
