# wix-ui-codemod

This package contains a collection of [jscodeshift](https://github.com/facebook/jscodeshift) codemod scripts to help migrate and adapt Wix UI projects to API changes.

## Usage

```bash
npx wix-ui-codemod <transform> <path> [...options]
```

- `transform` - name of transform, see available options below.
- `path` - path to file or directory where the codemod will be applied.
- `options` - available options are:
  - `--dry` - run in dry mode (will not modify any transformed files on disk).
  - `--print` - print modified files.

## Contributing

Thanks! See [contributing guide](./CONTRIBUTING.md).
