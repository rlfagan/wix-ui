# wix-style-react codemods

## Codemods
1. [Icons common](#wix-style-reacticons-common)
2. [Named imports](#wix-style-reactnamed-imports)
---

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

### wix-style-react/migrate-wsr10

```bash
npx wix-ui-codemod wix-style-react/migrate-wsr10 <PATH_TO_A_FILE/FOLDER>
```

Does general deprecation for component properties when migrating from version 9 to version 10.

#### Changes

1. Input

```diff
-  <Input size="normal" />
+  <Input size="medium" >
```

```diff
-  <Input roundInput />
+  <Input border="round" >
```

2. InputArea

```diff
-  <InputArea size="normal" />
+  <InputArea size="medium" >
```

3. MarketingLayout

```diff
-  <MarketingLayout size="large" />
+  <MarketingLayout />
```

4. RadioGroup

```diff
-  <RadioGroup lineHeight="24px" />
+  <RadioGroup />
```

5. AutoComplete

```diff
-  <AutoComplete roundInput />
+  <AutoComplete border="round" />
```

6. Dropdown

```diff
-  <Dropdown roundInput />
+  <Dropdown border="round" />
```

7. MultiSelect

```diff
-  <MultiSelect roundInput />
+  <MultiSelect border="round" />
```

8. MultiSelectCheckbox

```diff
-  <MultiSelectCheckbox roundInput />
+  <MultiSelectCheckbox border="round" />
```

9. NumberInput

```diff
-  <NumberInput roundInput />
+  <NumberInput border="round" />
```

10. Search

```diff
-  <Search roundInput />
+  <Search border="round" />
```
#### Which kind of properties codemod can cover

- string based i.e. <InputArea prop="something">
- jsx expression container based strings i.e. <InputArea prop={'something'}>
- boolean values i.e. <InputArea prop>
- jsx expression container based boolean values i.e. <InputArea prop={true}>

Other kind of properties like variables cannot be assumed and are left for consumer to handle manually.
