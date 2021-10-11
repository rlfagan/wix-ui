import { Transform } from 'jscodeshift';

const transform: Transform = (file, api) => {
  const namedImports: Set<string> = new Set();
  const namedCompositesImports: Set<string> = new Set();
  const namedResponsiveCompositesImports: Set<string> = new Set();
  const j = api.jscodeshift;
  const root = j(file.source);

  // Match all imports from wix-ui-adi
  const importMatch = /wix-base-ui/;
  const importCSSMatch = /.scss$/;

  // Get all relevant composites imports
  const replaceCompositesImports = (regex, replaceStr, collection) => {
    const compositesNodes = root
      .find(j.ImportDeclaration)
      .filter((path) =>
        [
          path.node.specifiers.length,
          importMatch.test(path.node.source.value as string),
          regex.test(path.node.source.value as string),
          path.node.importKind === 'value',
        ].every(Boolean),
      );

    // Replace imports
    if (compositesNodes.length > 0) {
      namedImports.add(replaceStr);
      compositesNodes
        .find(j.ImportSpecifier)
        .find(j.Identifier)
        .forEach((path) => {
          collection.add(path.node.name);
        });
      compositesNodes.replaceWith('');
    }
  };

  replaceCompositesImports(
    /^((?!responsive-).)*composites/,
    'Composites',
    namedCompositesImports,
  );
  replaceCompositesImports(
    /responsive-composites/,
    'ResponsiveComposites',
    namedResponsiveCompositesImports,
  );

  // Get all relevant components imports
  const importNodes = root
    .find(j.ImportDeclaration)
    .filter((path) =>
      [
        path.node.specifiers.length,
        importMatch.test(path.node.source.value as string),
        /^((?!composites).)*$/.test(path.node.source.value as string),
        path.node.importKind === 'value',
      ].every(Boolean),
    );

  // Add current correct imports
  importNodes.find(j.ImportDefaultSpecifier).forEach((path) => {
    namedImports.add(path.node.local.name);
  });
  importNodes.find(j.ImportSpecifier).forEach((path) => {
    if (path.node.imported.name !== path.node.local.name) {
      namedImports.add(`${path.node.imported.name} as ${path.node.local.name}`);
    } else {
      namedImports.add(path.node.local.name);
    }
  });

  // Replace composites prefix
  namedCompositesImports.forEach((importName) => {
    root
      .find(j.Identifier, {
        name: importName,
      })
      .replaceWith(`Composites.${importName}`);
  });

  // Replace responsive composites prefix
  namedResponsiveCompositesImports.forEach((importName) => {
    root
      .find(j.Identifier, {
        name: importName,
      })
      .replaceWith(`ResponsiveComposites.${importName}`);
  });

  // Replace imports
  importNodes.replaceWith((_, i) => {
    if (i === 0) {
      return j.importDeclaration(
        Array.from(namedImports)
          .sort()
          .map((importName) => j.importSpecifier(j.identifier(importName))),
        j.stringLiteral('@wix/wix-base-ui'),
      );
    }
  });

  // Get all relevant CSS imports
  const importCSS = root.find(j.ImportDeclaration).filter((path) =>
    [
      // path.node.specifiers.length,
      importMatch.test(path.node.source.value as string),
      importCSSMatch.test(path.value.source.value as string),
    ].every(Boolean),
  );

  // Remove CSS imports
  importCSS.replaceWith('');

  if (
    importCSS.length > 0 ||
    namedImports.size > 0 ||
    namedCompositesImports.size > 0 ||
    namedResponsiveCompositesImports.size > 0
  ) {
    return root.toSource({
      quote: 'single',
      reuseWhitespace: true,
    });
  }
};

export default transform;
