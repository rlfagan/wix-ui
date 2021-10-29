import React from 'react';
import DoDont from '..';

const doList = [
  'Use it to display text paragraphs formed from a single or multiple sentences.',
  'Use it to display text paragraphs formed from a single or multiple sentences.',
];

const dontList = ['Don’t use it to highlight status, use <Badge/> instead.'];

export default () => <DoDont do={{ list: doList }} dont={{ list: dontList }} />;
