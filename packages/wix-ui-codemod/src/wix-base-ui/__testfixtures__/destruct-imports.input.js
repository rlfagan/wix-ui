import { Hello } from 'hello';
import UI from 'baseUILib';
import baseUILib from 'baseUILib';
import { Hi } from 'hi';

console.log(UI.Divider);

React.createElement(baseUILib.Divider, {
  className: 'divider',
});

() => <UI.Thumbnails />;

() => (
  <UI.Composites.Thumbnails>
    <baseUILib.Thumbnails />
  </UI.Composites.Thumbnails>
);
