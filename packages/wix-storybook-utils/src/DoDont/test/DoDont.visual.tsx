import React from 'react';
import { storiesOf } from '@storybook/react';
import DoDont from '..';

const doList = [
  'Use it to display text paragraphs formed from a single or multiple sentences.Use it to display text paragraphs formed from a single or multiple sentences.Use it to display text paragraphs formed from a single or multiple sentences.',
  'Use it to display text paragraphs formed from a single or multiple sentences.Use it to display text paragraphs formed from a single or multiple sentences.Use it to display text paragraphs formed from a single or multiple sentences.',
];

const dontList = [
  'Don’t use it to highlight status, use <Badge/> instead.Don’t use it to highlight status, use <Badge/> instead.Don’t use it to highlight status, use <Badge/> instead.Don’t use it to highlight status, use <Badge/> instead.',
  'Don’t use it to highlight status, use <Badge/> instead.Don’t use it to highlight status, use <Badge/> instead.Don’t use it to highlight status, use <Badge/> instead.Don’t use it to highlight status, use <Badge/> instead.',
];

const tests = [
  {
    it: 'should render do list',
    props: {
      do: { list: doList },
    },
  },
  {
    it: 'should render do list with custom title',
    props: {
      do: { list: doList, title: 'custom do' },
    },
  },
  {
    it: 'should render dont list',
    props: {
      dont: { list: dontList },
    },
  },
  {
    it: 'should render dont list with custom title',
    props: {
      dont: { list: dontList, title: 'custom dont' },
    },
  },
] as const;

tests.forEach(({ it, props }) => {
  storiesOf('DoDont', module).add(it, () => <DoDont {...props} />);
});
