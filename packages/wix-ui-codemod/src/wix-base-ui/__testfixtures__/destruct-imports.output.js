import { Hello } from 'hello';
import { Composites, Divider, Thumbnails } from '@wix/wix-base-ui';
import { Hi } from 'hi';

console.log(Divider);

React.createElement(Divider, {
  className: 'divider',
});

() => <Thumbnails />;

() => (
  <Composites.Thumbnails>
    <Thumbnails />
  </Composites.Thumbnails>
);
