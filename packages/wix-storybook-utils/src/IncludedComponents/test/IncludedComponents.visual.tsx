import React from 'react';
import { storiesOf } from '@storybook/react';
import IncludedComponents from '..';

const tests = [
  {
    it: `should render components list`,
    props: {
      includedComponents: [
        { category: 'Category', title: 'FirstComponent' },
        { category: 'Category', title: 'SecondComponent' },
      ],
    },
  },
  {
    it: `should render optional components list`,
    props: {
      includedComponents: [
        { category: 'Category', title: 'FirstComponent', optional: true },
        { category: 'Category', title: 'SecondComponent', optional: true },
      ],
    },
  },
] as const;

tests.forEach(({ it, props }) => {
  storiesOf('IncludedComponents', module).add(it, () => (
    <IncludedComponents {...props} />
  ));
});
