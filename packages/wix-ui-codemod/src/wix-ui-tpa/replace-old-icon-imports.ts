import { Transform } from 'jscodeshift';
import importMapping from './__testutils__/old-to-new-icons-mapping';

const iconImportRegExp = /^wix-ui-tpa\/dist\/src\/assets\/icons\/(.*)$/;
const transformIconImports: Transform = (fileInfo, api) => {
  const { jscodeshift } = api;
  const root = jscodeshift(fileInfo.source);
  let newImport;
  let isImportTransformed = false;
  const transformSourceImport = (source: string) => {
    isImportTransformed = true;

    return source.replace(source, importMapping.get(source));
  };

  // Transform ES module imports for icons
  root.find(jscodeshift.ImportDeclaration).forEach((importDecleration) => {
    const sourceNode = importDecleration.value.source;
    const localNode = importDecleration.value.specifiers[0].local;

    if (
      typeof sourceNode.value === 'string' &&
      iconImportRegExp.test(sourceNode.value)
    ) {
      const newImportValue = transformSourceImport(sourceNode.value);
      const specifiers = [];
      const { importKind } = importDecleration.value;

      specifiers[0] = jscodeshift.importDefaultSpecifier(
        jscodeshift.identifier(localNode.name),
      );
      newImport = jscodeshift.importDeclaration(
        specifiers,
        jscodeshift.stringLiteral(newImportValue),
        importKind,
      );

      jscodeshift(importDecleration).remove();
      importDecleration.insertAfter(newImport);
    }
  });

  if (!isImportTransformed) {
    return;
  }

  return root.toSource({
    quote: 'single',
    trailingComma: true,
  });
};

export default transformIconImports;
