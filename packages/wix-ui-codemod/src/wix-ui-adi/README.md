## wix-ui-adi codemods

### wix-ui-adi/imports-from-main-index
```bash
npx wix-ui-codemod wix-ui-adi/imports-from-main-index <PATH_TO_A_FILE/FOLDER>
```

Will replace deprecated imports from `@wix/wix-ui-adi/<COMP_NAME>` with imports from the main index.

Transform imports from:
```jsx
import { Input } from '@wix/wix-ui-adi/Input';
import { Panel } from 'wix-ui-adi/Panel';
```

To:
```jsx
import { Input, Panel } from '@wix/wix-ui-adi';
```

With the exception for Icons, this stays the same:
```jsx
import MyIcon from '@wix/wix-ui-adi/dist/src/components/Icons/dist/components/MyIcon';
```
