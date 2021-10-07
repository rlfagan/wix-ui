import * as React from 'react';
import { LinearProgressBar } from '../../src/components/linear-progress-bar';
import { classes } from './style.st.css';
import { Category } from '../utils';

export default {
  category: Category.COMPONENTS,
  name: 'LinearProgressBar',
  storyName: 'LinearProgressBar',
  component: LinearProgressBar,
  componentPath: '../../src/components/linear-progress-bar',

  componentProps: {
    className: classes.root,
    'data-hook': 'progress-bar',
    value: 10,
    showProgressIndication: false,
    error: false,
  },
  exampleProps: {
    customSuffixIndicationText: [{label: 'suffix text', value: '35'}],
    prefixIndication: [{label: 'prefix', value: '5 stars'}],
  },
};
