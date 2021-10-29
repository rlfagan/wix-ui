import DoDont from '..';
import * as examples from './DoDont.examples';
import content from './DoDont.content';
import demo from './DoDont.demo';

export default {
  category: 'StorybookUI',
  storyName: 'DoDont',
  component: DoDont,
  componentPath: '../DoDont.tsx',
  story: {
    demo,
    content,
    examples,
  },
};
