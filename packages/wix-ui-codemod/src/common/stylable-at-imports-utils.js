/** Utils function for the new stylable import type - atRule syntax */

const {
  removeFirstAndLastChars,
  replaceDefaultWithNamed,
  replaceNamedImportWithPrefixNamedImport,
} = require('./stylable-imports-utils');

/**
 *
 * @param expression
 * @returns {{exportsNames, importPath}}
 */
const splitAtImportExportsPartsAndPath = (expression) => {
  const splittedImport = expression.split(' from ');

  return {
    exportsNames: splittedImport[0].trim(),
    importPath: splittedImport[1].trim(),
  };
};

/**
 * Check if it is a named import only, meaning that it is wrapped by `[]`.
 *
 * @param exportsNames
 * @returns {boolean} - return true whether it is a named import
 */
const isNewImportTypeNameOnly = (exportsNames) => {
  return exportsNames.startsWith('[') && exportsNames.endsWith(']');
};

/**
 * Check if it is a default import only, meaning that the exportsNames doesn't includes`[`, `]`.
 *
 * @param exportsNames
 * @returns {boolean} - return true whether it is a named import
 */
const isNewImportTypeDefaultOnly = (exportsNames) => {
  return !exportsNames.includes('[') && !exportsNames.includes(']');
};

/**
 * Split the exports names into 2 parts: default and named
 *
 * @param exportsNames
 * @returns {{defaultPart: string, namedPart: string}}
 */
const splitAtImportDefaultAndNamed = (exportsNames) => {
  let defaultPart, namedPart;

  if (isNewImportTypeNameOnly(exportsNames)) {
    // named only
    namedPart = removeFirstAndLastChars(exportsNames);
  } else if (isNewImportTypeDefaultOnly(exportsNames)) {
    // default only
    defaultPart = exportsNames;
  } else {
    // named and default
    let splittedImport;

    const isNamedFirst = exportsNames.startsWith('[');

    if (isNamedFirst) {
      splittedImport = exportsNames.split(']');
      defaultPart = splittedImport[1];
      namedPart = splittedImport[0].replace('[','');
    } else {
      splittedImport = exportsNames.split('[');
      defaultPart = splittedImport[0];
      namedPart = splittedImport[1].replace(']','');
    }
    defaultPart = defaultPart.replace(',', '').trim();
  }

  return {
    defaultPart,
    namedPart,
  };
};

/**
 * transform the exportsNames of the new import syntax
 * @param exportsNames
 * @param componentName
 * @returns {string} - trasformed export names
 */
function replaceAtImportExportsNamesWithPrefixNamedImport(
  exportsNames,
  componentName,
) {
  const transformedExportNames = [];
  const splittedExportParts = splitAtImportDefaultAndNamed(exportsNames);

  if (splittedExportParts.defaultPart) {
    transformedExportNames.push(
      replaceDefaultWithNamed(splittedExportParts.defaultPart, componentName),
    );
  }
  if (splittedExportParts.namedPart) {
    transformedExportNames.push(
      replaceNamedImportWithPrefixNamedImport(
        splittedExportParts.namedPart,
        componentName,
      ),
    );
  }

  return `[${transformedExportNames.join(', ')}]`;
}

module.exports.splitAtImportExportsPartsAndPath = splitAtImportExportsPartsAndPath;
module.exports.splitAtImportDefaultAndNamed = splitAtImportDefaultAndNamed;
module.exports.replaceAtImportExportsNamesWithPrefixNamedImport = replaceAtImportExportsNamesWithPrefixNamedImport;
