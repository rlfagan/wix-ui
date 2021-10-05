import { Hello } from 'hello';
import Divider from '@wix/wix-base-ui/lib/controls/divider';
import TextLabel from 'wix-base-ui/lib/controls/textLabel';
import { Button as BaseButton, Badge } from '@wix/wix-base-ui';
import { ActionWithSymbolLabeled, PopupSmallSize } from '@wix/wix-base-ui/lib/composites/composites';
import { MultiInputsInRow } from 'wix-base-ui/lib/responsive-composites/responsiveComposites';
import { Hi } from 'hi';
import '@wix/wix-base-ui/src/composites/panelContent.scss';
import '@wix/wix-base-ui/src/composites/richText.scss';
import '@wix/wix-base-ui/src/composites/richTextWithIllustration.scss';

console.log(Divider);
console.log(TextLabel);
console.log(ActionWithSymbolLabeled);
console.log(MultiInputsInRow);

() => (
  <ActionWithSymbolLabeled>
    <Divider>
      <PopupSmallSize>
        <TextLabel />
        <BaseButton />
        <Badge />
      </PopupSmallSize>
    </Divider>
  </ActionWithSymbolLabeled>
);

() => (
  <MultiInputsInRow>
    <Divider />
  </MultiInputsInRow>
)
