import IncludedComponents from '..';
import * as examples from './IncludedComponents.examples';
import content from './IncludedComponents.content';
import demo from './IncludedComponents.demo';

export default {
  category: 'StorybookUI',
  storyName: 'IncludedComponents',
  component: IncludedComponents,
  componentPath: '../IncludedComponents.tsx',
  story: {
    demo,
    content,
    examples,
  },
};
