import { Transform } from 'jscodeshift';

const transform: Transform = (file, api) => {
  const namedImports: Set<string> = new Set();
  const j = api.jscodeshift;
  const root = j(file.source);

  // Match all imports from wix-ui-adi
  const importMatch = /wix-ui-adi/;
  // Match importing icons from dist/src/components/Icons
  const iconsMatch = /^((?!dist\/src\/components\/Icons).)*$/;

  // Get all relevant imports
  const importNodes = root
    .find(j.ImportDeclaration)
    .filter((path) =>
      [
        path.node.specifiers.length,
        importMatch.test(path.node.source.value as string),
        iconsMatch.test(path.node.source.value as string),
        path.node.importKind === 'value',
      ].every(Boolean),
    );

  // Add current correct imports
  importNodes.find(j.ImportSpecifier).forEach((path) => {
    if (path.node.imported.name !== path.node.local.name) {
      namedImports.add(`${path.node.imported.name} as ${path.node.local.name}`);
    } else {
      namedImports.add(path.node.local.name);
    }
  });

  // Replace imports
  importNodes.replaceWith((_, i) => {
    if (i === 0) {
      return j.importDeclaration(
        Array.from(namedImports)
          .sort()
          .map((importName) => j.importSpecifier(j.identifier(importName))),
        j.stringLiteral('@wix/wix-ui-adi'),
      );
    }
  });

  if (importNodes.length > 0) {
    return root.toSource({
      quote: 'single',
      reuseWhitespace: true,
    });
  }
};

export default transform;
