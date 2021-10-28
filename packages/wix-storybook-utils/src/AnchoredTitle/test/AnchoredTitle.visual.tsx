import React from 'react';
import { storiesOf } from '@storybook/react';
import AnchoredTitle from '..';

const tests = [
  {
    it: 'render with string based title',
    props: {
      title: 'title',
    },
  },
  {
    it: 'render with node based title',
    props: {
      title: 'not shown',
      children: <a>node</a>,
    },
  },
];

tests.forEach(({ it, props }) => {
  storiesOf('AnchoredTitle', module).add(it, () => (
    <div style={{ marginLeft: '50px' }}>
      <AnchoredTitle {...props} />
    </div>
  ));
});
