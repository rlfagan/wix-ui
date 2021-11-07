# wix-ui-codemod
This package contains a collection of [jscodeshift](https://github.com/facebook/jscodeshift) codemod scripts to help migrate and adapt Wix UI projects to API changes.

## Usage
###For JS codemods:

```bash
npx wix-ui-codemod <transform> <path> [...options]
```

- `transform` - name of transform, see available options below.
- `path` - path to file or directory where the codemod will be applied.
- `options` - available options are:
  - `--dry` - run in dry mode (will not modify any transformed files on disk).
  - `--print` - print modified files.

###For Stylable codemods:
```bash
npx -p wix-ui-codemod wix-ui-codemod-stylable <transform>
```

- `transform` - name of transform, see available options below. For example: `wix-ui-tpa/import-stylesheet-via-index-file`

## Codemods
- [wix-style-react](./src/wix-style-react/README.md)
- [wix-base-ui](./src/wix-base-ui/README.md)
- [wix-ui-adi](./src/wix-ui-adi/README.md)

## Contributing
Thanks! See [contributing guide](./CONTRIBUTING.md).
