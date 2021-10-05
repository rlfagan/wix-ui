import { Hello } from 'hello';
import { Input } from '@wix/wix-ui-adi/Input';
import { Panel } from 'wix-ui-adi/Panel';
import { Button as BaseButton } from '@wix/wix-ui-adi/Button';
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
