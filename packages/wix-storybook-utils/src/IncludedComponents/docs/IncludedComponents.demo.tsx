import React from 'react';
import { StorybookComponents } from '../../StorybookComponents';
import IncludedComponents from '..';

export default () => (
  <StorybookComponents.Stack flexDirection="column">
    <IncludedComponents
        componentsList={[
        { category: 'Category', title: 'FirstComponent', optional: true },
        { category: 'Category', title: 'SecondComponent' },
      ]}
    />
  </StorybookComponents.Stack>
);
