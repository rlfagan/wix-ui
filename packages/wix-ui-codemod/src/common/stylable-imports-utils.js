/**
 * Get the component name from the import path
 *
 * @param importPath
 * @param componentNamePattern
 * @returns componentName
 */
function getComponentNameFromImportPath(importPath, componentNamePattern) {
  let componentName;
  const regex = new RegExp(componentNamePattern.regexp, 'g');

  if (regex.test(importPath)) {
    componentName = importPath.replace(regex, `$${componentNamePattern.groupNumberForComponentName}`);

    // remove the string quotation marks
    componentName = removeFirstAndLastChars(componentName);
  }

  return componentName;
}

/**
 * return the matched replacement rule
 *
 * @param currentImportPath
 * @param rules
 * @returns {{type, regexp, changeTo }}
 */
function getMatchedReplacementRule(currentImportPath, rules) {
  return rules.find((importPathItem) => {
    const regex = new RegExp(importPathItem.regexp, 'g');
    const isForbiddenImport = regex.test(currentImportPath);

    if (isForbiddenImport) {
      return true;
    }
  });
}

/**
 * Check if it is a named imported, meaning that there is an 'as'.
 *
 * @param path
 * @returns {boolean} - return true whether it is a named import
 */
const isNamedImport = (path) => {
  const splittedImport = path.split(' as ');
  return splittedImport.length > 1;
};

/**
 * return an object that split the `-st-named: exportsName as alias` into 2 parts
 *
 * @param namedExpression - the full `-st-named` value
 * @returns {{ exportsName: string, alias: string }}
 */
const getExportsNameAndAlias = (namedExpression) => {
  const splittedImport = namedExpression.split(' as ');

  return {
    exportsName: splittedImport[0].trim(),
    alias: splittedImport[1].trim(),
  };
};

/**
 * Remove the first and last chars
 *
 * @param str - a string
 * @returns - The value without the quotation marks
 */
const removeFirstAndLastChars = (str) => {
  return str.substr(1, str.length - 2);
};

/**
 * Add a prefix for each exportsNames
 *
 * @param exportsNames
 * @param prefix - the prefix that should be added for each of the export Name
 * @returns transformedExports - a string of the updated named import
 */
const replaceNamedImportWithPrefixNamedImport = (exportsNames, prefix) => {
  const splittedExportsNames = exportsNames.split(',').map((i) => i.trim());

  const transformedExports = splittedExportsNames.map((exportsName) => {
    let newExportsNameValue;
    if (isNamedImport(exportsName)) {
      const splittedNamedImport = getExportsNameAndAlias(exportsName);
      newExportsNameValue = `${prefix}__${splittedNamedImport.exportsName} as ${splittedNamedImport.alias}`;
    } else {
      newExportsNameValue = `${prefix}__${exportsName}`;
    }
    return newExportsNameValue;
  });

  return transformedExports.join(', ');
};

/**
 * Replace a default import with a named import
 *
 * @param actualDefaultImport
 * @param originalDefaultImport
 * @returns {string}
 */
const replaceDefaultWithNamed = (
  actualDefaultImport,
  originalDefaultImport,
) => {
  return actualDefaultImport === originalDefaultImport
    ? originalDefaultImport
    : `${originalDefaultImport} as ${actualDefaultImport}`;
};

module.exports.isNamedImport = isNamedImport;
module.exports.getComponentNameFromImportPath = getComponentNameFromImportPath;
module.exports.getMatchedReplacementRule = getMatchedReplacementRule;
module.exports.getExportsNameAndAlias = getExportsNameAndAlias;
module.exports.removeFirstAndLastChars = removeFirstAndLastChars;
module.exports.replaceNamedImportWithPrefixNamedImport = replaceNamedImportWithPrefixNamedImport;
module.exports.replaceDefaultWithNamed = replaceDefaultWithNamed;
