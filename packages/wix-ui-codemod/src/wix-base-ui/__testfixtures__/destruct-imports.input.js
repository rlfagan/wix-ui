import { Hello } from 'hello';
import * as YY from 'wix-style-react';
import * as XX from '@wix/wix-base-ui';
import UI from 'baseUILib';
import baseUILib from 'baseUILib';
import wixBaseUI from '@wix/wix-base-ui';
import { Text, Divider } from '@wix/wix-base-ui';
import { Hi } from 'hi';
import * as textLabelDriver from '@wix/wix-base-ui/lib/drivers/textLabelDriver';

console.log(UI.Divider);
console.log(baseUILib.Divider);
console.log(XX.Divider);
console.log(wixBaseUI.Divider);
console.log(Divider);

React.createElement(baseUILib.Divider, {
  className: 'divider',
});

() => <UI.Thumbnails />;

() => (
  <UI.Composites.Thumbnails>
    <baseUILib.Thumbnails />
    <XX.Thumbnails />
    <wixBaseUI.Thumbnails />
    <Text />
  </UI.Composites.Thumbnails>
);
