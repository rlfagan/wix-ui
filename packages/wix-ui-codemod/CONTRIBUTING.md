# Contributing guide

## Getting Started

```bash
npm i # install dependencies
npm test # build and run tests
npm run build # just build
node . <transform> <path> # run codemod transform
```

## Adding new codemod transform

Add your new codemod based on UI project the codemod is designed for. A `wix-style-react` codemod would go to `src/wix-style-react/my-codemod.ts` for example.

Don't forget to update [README.md](./README.md) file with description and details for your new transform.

## Adding tests

Tests are run using Jest and use [built-in testing support](https://github.com/facebook/jscodeshift#unit-testing) provided by jscodeshift library.

1. Add a spec file for your transform (`src/wix-style-react/__tests__/my-codemod.spec.ts`).
2. Define your tests using `defineTest()` function.
3. Define expected input and output fixture data in `src/wix-style-react/__testfixtures__/*`.

## Useful links

- [jscodeshift](https://github.com/facebook/jscodeshift) - The library used to run and write codemods.
- [AST Explorer](https://astexplorer.net/) - Use this online tool to understand the abstract syntax tree generated by `api.jscodeshift(...)` call. Make sure to select "recast" as a parser.
- [recast](https://github.com/benjamn/recast) - jscodeshift is a wrapper around recast (providing a simpler API for manipulating AST tree).