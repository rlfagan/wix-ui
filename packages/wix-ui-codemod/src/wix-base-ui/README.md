# wix-base-ui codemods

## Codemods
1. [Imports from main index](#wix-base-uiimports-from-main-index)
2. [Destruct imports](#wix-base-uidestruct-imports)
---

### wix-base-ui/imports-from-main-index
```bash
npx wix-ui-codemod wix-base-ui/imports-from-main-index <PATH_TO_A_FILE/FOLDER>
```

Will replace deprecated imports from `@wix/wix-base-ui/lib/src/...` with imports from the main index.

Transform imports from:
```jsx
import Divider from '@wix/wix-base-ui/lib/controls/divider';
import { PopupSmallSize } from '@wix/wix-base-ui/lib/composites/composites';

<PopupSmallSize>
  <Divider />
</PopupSmallSize>
```

To:
```jsx
import { Composites, Divider } from '@wix/wix-base-ui';

<Composites.PopupSmallSize>
  <Divider />
</Composites.PopupSmallSize>
```

Also this codemod deletes all scss imports:
```jsx
import '@wix/wix-base-ui/src/composites/panelContent.scss';
```

---
### wix-base-ui/destruct-imports
```bash
npx wix-ui-codemod wix-base-ui/destruct-imports <PATH_TO_A_FILE/FOLDER>
```

Will replace deprecated imports `import * as UI` with destructed imports from the main index.

Transform imports from:
```jsx
import UI from 'baseUILib';
import UI from '@wix/wix-base-ui';
import * as UI from '@wix/wix-base-ui';

<UI.Thumbnails />;
```

To:
```jsx
import { Thumbnails } from '@wix/wix-base-ui';

<Thumbnails />;
```
