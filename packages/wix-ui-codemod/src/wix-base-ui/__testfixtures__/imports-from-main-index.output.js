import { Hello } from 'hello';

import {
  Badge,
  Button as BaseButton,
  Composites,
  Divider,
  ResponsiveComposites,
  TextLabel,
} from '@wix/wix-base-ui';

import { Hi } from 'hi';

console.log(Divider);
console.log(TextLabel);
console.log(Composites.ActionWithSymbolLabeled);
console.log(ResponsiveComposites.MultiInputsInRow);

() => (
  <Composites.ActionWithSymbolLabeled>
    <Divider>
      <Composites.PopupSmallSize>
        <TextLabel />
        <BaseButton />
        <Badge />
      </Composites.PopupSmallSize>
    </Divider>
  </Composites.ActionWithSymbolLabeled>
);

() => (
  <ResponsiveComposites.MultiInputsInRow>
    <Divider />
  </ResponsiveComposites.MultiInputsInRow>
)
