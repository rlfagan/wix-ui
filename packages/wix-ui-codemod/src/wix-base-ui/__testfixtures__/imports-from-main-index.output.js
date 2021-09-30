import { Hello } from 'hello';
import { Composites, Divider, ResponsiveComposites, TextLabel } from '@wix/wix-base-ui';
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
      </Composites.PopupSmallSize>
    </Divider>
  </Composites.ActionWithSymbolLabeled>
);

() => (
  <ResponsiveComposites.MultiInputsInRow>
    <Divider />
  </ResponsiveComposites.MultiInputsInRow>
)
