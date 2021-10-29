import React from 'react';
import { storiesOf } from '@storybook/react';
import { StorybookComponents } from '../../StorybookComponents';
import Text from '..';

const sizes = ['tiny', 'small', 'medium'];
const weights = ['thin', 'normal', 'bold'];

const tests = [
  ...sizes.reduce((accu, size) => {
    weights.forEach(weight =>
      accu.push({
        it: `size=${size} weight=${weight}`,
        props: {
          size,
          weight,
          children: `Text - size=${size}, weight=${weight}`,
        },
      }),
    );
    return accu;
  }, []),
  {
    it: 'light=true',
    props: {
      light: true,
      children: 'Text - light',
    },
    background: 'dark',
  },
  {
    it: 'light=true secondary=true',
    props: {
      light: true,
      secondary: true,
      children: 'Text - light secondary',
    },
  },
  {
    it: 'secondary',
    props: {
      secondary: true,
      children: 'Text - secondary',
    },
  },
] as const;

tests.forEach(({ it, props, background = 'light' }) => {
  storiesOf('Text', module).add(it, () => (
    <StorybookComponents.Background skin={background}>
      <Text {...props} />
    </StorybookComponents.Background>
  ));
});
