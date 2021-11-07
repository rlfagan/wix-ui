import React from 'react';
import { storiesOf } from '@storybook/react';
import IncludedComponents from '..';

const componentsList = [
  { category: 'Category', title: 'FirstComponent', optional: true },
  { category: 'Category', title: 'SecondComponent' },
];

const tests = [
  {
    it: `should render included components list`,
    props: { componentsList },
  },
] as const;

tests.forEach(({ it, props }) => {
  storiesOf('IncludedComponents', module).add(it, () => <IncludedComponents {...props} />);
});
