## wix-style-react codemods

### wix-style-react/icons-common
```bash
npx wix-ui-codemod wix-style-react/icons-common <PATH_TO_A_FILE/FOLDER>
```

Will replace deprecated icon imports from `wix-style-react/new-icons` with imports from `wix-ui-icons-common` package.

```diff
- import Add from 'wix-style-react/new-icons/Add';
+ import Add from 'wix-ui-icons-common/Add';
```

---
### wix-style-react/named-imports

```bash
npx wix-ui-codemod wix-style-react/named-imports <PATH_TO_A_FILE/FOLDER>
```

Converts all `wix-style-react/ComponentName` imports to the optimal form for tree shaking:

```diff
- import TextButton from 'wix-style-react/TextButton';
+ import { TextButton } from 'wix-style-react';
```
