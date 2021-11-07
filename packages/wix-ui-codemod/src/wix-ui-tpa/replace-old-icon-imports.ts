import { Transform, ImportSpecifier } from 'jscodeshift';
import {
  iconNamesMapping,
  newIconImportPath,
  forbiddenIconsSet,
} from './__testutils__/old-to-new-icons-mapping';

const chalk = require('chalk'); // eslint-disable-line import/no-extraneous-dependencies

const oldIconImportsRegularExpressions = {
  importPathContainsOldIconName: /^wix-ui-tpa\/dist\/src\/assets\/icons\/(?!index)(.*)\.(.*)$/,
  importPathWithoutOldIconName: /^wix-ui-tpa\/dist\/src\/assets\/(icons|icons\/index)$/,
};

/**
 * Replace the old icon import path with the correct new icon import path
 *
 * @param from
 * @param to
 * @returns {string} the correct new icon import path
 */
const replaceImportPath = (from: string, to: string): string =>
  from.replace(from, to);

/**
 *
 * @param importDecleration
 * @returns {string} the name of the old icon
 */
const getOldIconName = (importDecleration): string => {
  const importPath = importDecleration.value.source.value;
  let oldIconName: string;

  if (isIconNameIncludedInImportPath(importPath)) {
    const regEx = new RegExp(
      oldIconImportsRegularExpressions.importPathContainsOldIconName,
      'g',
    );

    oldIconName = importPath.replace(regEx, '$1');
  } else {
    oldIconName = (importDecleration.value.specifiers[0] as ImportSpecifier)
      .imported.name;
  }

  return oldIconName;
};

/**
 * Check if an old icon is being imported
 *
 * @param importPath
 * @returns {boolean} Whether an old icon is being imported
 */
const isImportingOldIcon = (importPath: string): boolean => {
  let isOldIcon = false;

  for (const regularExpression of Object.values(
    oldIconImportsRegularExpressions,
  )) {
    if (new RegExp(regularExpression, 'g').test(importPath)) {
      isOldIcon = true;
      break;
    }
  }

  return isOldIcon;
};

/**
 * Check if the icon name is in the import path, unlike an import from `/icons` or `/icons/index`
 *
 * @param importPath
 * @returns {boolean} Whether the old icon name appears in the import path
 */
const isIconNameIncludedInImportPath = (importPath: string): boolean =>
  new RegExp(
    oldIconImportsRegularExpressions.importPathContainsOldIconName,
  ).test(importPath);

const warnThatIconIsForbidden = (forbiddenIcon: string, api) =>
  console.error(
    chalk.red(
      `The ${forbiddenIcon} icon is an internal icon. Please contact us to discuss options for replacing it.`,
    ),
  );

const isIconForbidden = (icon: string): boolean => forbiddenIconsSet.has(icon);

const getExportNames = (importDecleration, jscodeshift) => {
  const exportName = importDecleration.value.specifiers[0].local;
  const exportNames = [];

  exportNames[0] = jscodeshift.importDefaultSpecifier(
    jscodeshift.identifier(exportName.name),
  );

  return exportNames;
};

const transformIconImports: Transform = (fileInfo, api) => {
  const { jscodeshift } = api;
  const root = jscodeshift(fileInfo.source);
  let newImport;
  let isImportTransformed = false;

  // Transform ES module imports for icons
  root.find(jscodeshift.ImportDeclaration).forEach((importDecleration) => {
    const importPath = importDecleration.value.source.value;

    if (typeof importPath === 'string' && isImportingOldIcon(importPath)) {
      const oldIconName = getOldIconName(importDecleration);

      if (isIconForbidden(oldIconName)) {
        warnThatIconIsForbidden(oldIconName, api);
        return;
      }

      isImportTransformed = true;

      const toImportPath = `${newIconImportPath}/${iconNamesMapping[oldIconName]}`;
      const newImportPath = replaceImportPath(importPath, toImportPath);
      const exportNames = getExportNames(importDecleration, jscodeshift);
      const { importKind } = importDecleration.value;

      newImport = jscodeshift.importDeclaration(
        exportNames,
        jscodeshift.stringLiteral(newImportPath),
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
