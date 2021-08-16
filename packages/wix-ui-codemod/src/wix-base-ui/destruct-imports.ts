import { Transform, ASTPath, MemberExpression, Identifier } from 'jscodeshift';

const transform: Transform = (file, api) => {
  const namedImports: Set<string> = new Set();
  const j = api.jscodeshift;
  const root = j(file.source);

  const removeMembers = (node: ASTPath<MemberExpression>) => {
    const memberName = (node.value.property as Identifier).name;

    // Add to imports
    namedImports.add(memberName);

    return j.identifier(memberName);
  };

  // Get all relevant imports
  const importNodes = root
    .find(j.ImportDeclaration)
    .filter((path) =>
      [
        path.node.specifiers.length,
        /baseUILib/.test(path.node.source.value as string),
        path.node.importKind === 'value',
      ].every(Boolean),
    );

  // Change elements name
  importNodes
    .find(j.ImportDefaultSpecifier)
    .find(j.Identifier)
    .forEach((importNode) => {
      const importName = importNode.value.name;

      root
        .find(j.MemberExpression, {
          object: { name: importName },
        })
        .replaceWith(removeMembers);
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

  return root.toSource({
    quote: 'single',
    reuseWhitespace: true,
  });
}

export default transform;
