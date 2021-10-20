# wix-ui-tpa codemods

## Codemods
1. [Import stylesheet via index.st.css](#wix-base-uiimport-stylesheet-via-index-file)
---

### wix-ui-tpa/import-stylesheet-via-index-file
```bash
npx
```

This codemode will help you with replacing the `wix-ui-tpa` stylesheets imports via the `dist` folder to the official entry files - `index.st.css`.

For more info, please read the migration guide: https://github.com/wix-private/wix-design-systems/blob/master/packages/wix-ui-tpa/docs/MIGRATION_GUIDE_FOR_STYLESHEET_IMPORTS.md


It transforms the imports in the following way:

1. 🔴 Change from this:

```css
:import {
   -st-from: "wix-ui-tpa/dist/src/components/ComponentName/ComponentName.st.css";
   -st-default: ComponentName;
}
```

into 🟢 ⤵️
```css
:import {
   -st-from: "wix-ui-tpa/index.st.css";
   -st-named: ComponentName;
}
```

2. 🔴 Change from this:

```css
:import {
   -st-from: "wix-ui-tpa/dist/src/components/ComponentName/ComponentName.st.css";
   -st-default: SomeName;
}
```

into 🟢 ⤵️
```css
:import {
   -st-from: "wix-ui-tpa/index.st.css";
   -st-named: ComponentName as SomeName;
}
```

3. 🔴 Change from this:

```css
:import {
    -st-from: "wix-ui-tpa/dist/src/components/ComponentName/ComponentName.st.css";
    -st-named: overrideStyleParams;
}
```

into 🟢 ⤵️️
```css
:import {
    -st-from: "wix-ui-tpa/index.st.css";
    -st-named: ComponentName__overrideStyleParams;
}
```

4. 🔴 Change from this:

```css
:import {
    -st-from: "wix-ui-tpa/dist/src/components/ComponentName/ComponentName.st.css";
    -st-named: overrideStyleParams as someName;
}
```

into 🟢 ⤵️️
```css
:import {
    -st-from: "wix-ui-tpa/index.st.css";
    -st-named: ComponentName__overrideStyleParams as someName;
}
```

5. 🔴 Change from this:

```css
:import {
    -st-from: "wix-ui-tpa/dist/src/components/ComponentName/ComponentName.st.css";
    -st-named: class1, class2;
}
```

into 🟢 ⤵️️
```css
:import {
    -st-from: "wix-ui-tpa/index.st.css";
    -st-named: ComponentName__class1, ComponentName__class2;
}
```

6. 🔴 Change from this:

```css
:import {
    -st-from: "wix-ui-tpa/dist/src/components/ComponentName/ComponentName.st.css";
    -st-named: class1 as someName1, class2 as someName2, class3;
}
```

into 🟢 ⤵️️
```css
:import {
    -st-from: "wix-ui-tpa/index.st.css";
    -st-named: ComponentName__class1 as someName1, ComponentName__class2 as someName2, ComponentName__class3;
}
```


7. 🔴 Change from this:
```css
   :import {
    -st-from: "wix-ui-tpa/dist/src/common/formatters.st";
    -st-named: font;
   }
```

into 🟢 ⤵️
```css
   :import {
    -st-from: "wix-ui-tpa/style-processor-formatters";
    -st-named: font;
   }
```

8. 🔴 Change from this:
```css
   :import {
    -st-from: "wix-ui-tpa/dist/src/common/formatters.st";
    -st-named: font as someName;
   }
```

into 🟢 ⤵️
```css
   :import {
    -st-from: "wix-ui-tpa/style-processor-formatters";
    -st-named: font as someName;
   }
```


Support also the new format:

1. 🔴 Change from this:

```css
    @st-import ComponentName from 'wix-ui-tpa/dist/src/components/ComponentName/ComponentName.st.css';
```

into 🟢 ⤵️
```css
    @st-import [ComponentName] from 'wix-ui-tpa/index.st.css';
```

2. 🔴 Change from this:

```css
    @st-import CustomName from 'wix-ui-tpa/dist/src/components/ComponentName/ComponentName.st.css';
```

into 🟢 ⤵️
```css
    @st-import [ComponentName as CustomName] from 'wix-ui-tpa/index.st.css';
```

3. 🔴 Change from this:

```css
    @st-import [overrideStyleParams] from 'wix-ui-tpa/dist/src/components/ComponentName/ComponentName.st.css';
```

into 🟢 ⤵️️
```css
    @st-import [ComponentName__overrideStyleParams] from 'wix-ui-tpa/index.st.css';
```

4. 🔴 Change from this:

```css
    @st-import ComponentName, [overrideStyleParams as SomeName] from 'wix-ui-tpa/dist/src/components/ComponentName/ComponentName.st.css';
```

into 🟢 ⤵️️
```css
    @st-import [ComponentName__overrideStyleParams as SomeName] from 'wix-ui-tpa/index.st.css';
```

4. 🔴 Change from this:

```css
    @st-import CustomName, [overrideStyleParams as SomeName] from 'wix-ui-tpa/dist/src/components/ComponentName/ComponentName.st.css';
```

into 🟢 ⤵️️
```css
    @st-import [ComponentName as CustomName, ComponentName__overrideStyleParams as SomeName] from 'wix-ui-tpa/index.st.css';
```

5. 🔴 Change from this:
```css
    @st-import [font] from 'wix-ui-tpa/dist/src/common/formatters.st';
```

into 🟢 ⤵️
```css
    @st-import [font] from 'wix-ui-tpa/style-processor-formatters';
```

6. 🔴 Change from this:
```css
    @st-import [font as SomeName] from 'wix-ui-tpa/dist/src/common/formatters.st';
```

into 🟢 ⤵️
```css
    @st-import [font as SomeName] from 'wix-ui-tpa/style-processor-formatters';
```
