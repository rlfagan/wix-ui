import { Transform } from 'jscodeshift';
import { importsObject } from './__testutils__/old-to-new-icons-mapping';

const iconImportRegExp = /^wix-ui-tpa\/dist\/src\/assets\/icons\/(.*)$/;
const transformSourceImport = (source: string) =>
  source.replace(source, importsObject[source]);
const transformIconImports: Transform = (fileInfo, api) => {
  const { jscodeshift } = api;
  const root = jscodeshift(fileInfo.source);
  let newImport;
  let isImportTransformed = false;

  // Transform ES module imports for icons
  root.find(jscodeshift.ImportDeclaration).forEach((importDecleration) => {
    const importPath = importDecleration.value.source;
    const importedModule = importDecleration.value.specifiers[0].local;

    if (
      typeof importPath.value === 'string' &&
      iconImportRegExp.test(importPath.value)
    ) {
      const newImportValue = transformSourceImport(importPath.value);
      const importedModules = [];
      const { importKind } = importDecleration.value;

      isImportTransformed = true;
      importedModules[0] = jscodeshift.importDefaultSpecifier(
        jscodeshift.identifier(importedModule.name),
      );
      newImport = jscodeshift.importDeclaration(
        importedModules,
        jscodeshift.stringLiteral(newImportValue),
        importKind,
      );

      importDecleration.insertAfter(newImport);
      jscodeshift(importDecleration).remove();
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
