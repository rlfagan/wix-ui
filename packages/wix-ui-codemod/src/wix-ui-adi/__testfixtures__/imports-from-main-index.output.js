import { Hello } from 'hello';
import { Button as BaseButton, Input, Panel } from '@wix/wix-ui-adi';
import MyIcon from '@wix/wix-ui-adi/dist/src/components/Icons/dist/components/MyIcon';
import { Hi } from 'hi';

console.log(Input);
console.log(Panel);

() => (
  <Panel>
    <Input />
    <BaseButton />
  </Panel>
);
