/* global Promise */

const fs = require('fs')
const jsonStringify = require('json-stable-stringify')
const csvStringify = require('csv-stringify/lib/sync')
const { join: pathJoin, dirname: pathDirname } = require('path');
const { buildGenerator, getProgramFromFiles, generateSchema } = require('typescript-json-schema-jakutis');
//const { createGenerator } = require('ts-json-schema-generator');
const { reactDocgenParse } = require('../parser/react-docgen-parse');

const readFile = require('../read-file');
const followExports = require('../follow-exports');
const resolveNodeModules = require('../resolve-node-modules');
const jsonSchemaToDocgen = require('./json-schema-to-docgen')

const parseDocgen = ({ source, path, options }) =>
  new Promise((resolve, reject) => {
    const parsed = reactDocgenParse({ source, path, options });

    return parsed.composes
      ? reject(parsed) // we'll handle composed props in catch
      : resolve(parsed);
  });

const mergeComponentProps = (components) =>
  components.reduce(
    (acc, component) => ({
      ...component.props,
      ...acc,
    }),
    {}
  );

const followComposedProps = (parsed, currentPath, options) =>
  Promise.all(
    parsed.composes.map((composedPath) => {
      const readablePathPromise = composedPath.startsWith('.')
        ? Promise.resolve(pathJoin(pathDirname(currentPath), composedPath))
        : resolveNodeModules(currentPath, composedPath.replace(/(dist\/|standalone\/)/g, ''));

      return readablePathPromise.then(readFile);
    })
  )

    .then((composedSourcesAndPaths) =>
      Promise.all(composedSourcesAndPaths.map(({ source, path }) => followExports(source, path)))
    )

    .then((composedSourcesAndPaths) =>
      Promise.all(
        composedSourcesAndPaths.map(({ source, path }) => ({
          parsed: reactDocgenParse({ source, path, options }),
          path,
        }))
      )
    )

    .then((parsedComponents) => {
      // here we receive list of object containing parsed component
      // props. some of them may contain composed props from other
      // components, in which case we followProps again recursively

      const withComposed = parsedComponents
        .filter(({ parsed }) => parsed.composes)
        .map(({ parsed, path }) => {
          //console.log('composes', parsed, path)
          return followComposedProps(parsed, path, options)
        });

      const withoutComposed = parsedComponents
        .filter(({ parsed }) => !parsed.composes)
        .map(({ parsed }) => Promise.resolve(parsed));

      return Promise.all([Promise.all(withComposed), Promise.all(withoutComposed)]).then(
        ([withComposed, withoutComposed]) => [...withComposed, ...withoutComposed]
      );
    })

    .then(mergeComponentProps)

    .then((composedProps) => {
      const allProps = {
        ...parsed,
        props: { ...parsed.props, ...composedProps },
      };

      // eslint-disable-next-line no-unused-vars
      const { composes, ...otherProps } = allProps;

      return otherProps;
    });

const getTypeFromPath = path => {
  const parts = path.split('/')
  const fileName = parts[parts.length - 1]
  return fileName.split('.')[0]
}

const getTypesPathFromPath = path => {
  const parts = path.split('/')
  parts.pop()
  parts.push('index.d.ts')
  return parts.join('/')
}
const append = (...cells) => fs.appendFileSync('/home/jakutis/results.csv', csvStringify([cells]))

const followProps = ({ source, path, options = {} }) => {
  if (!options.gatherAllContext.generator) {
    const programFiles = options.allPaths.map(path => getTypesPathFromPath(path)).filter(typesPath => fs.existsSync(typesPath))
    console.log('creating new')//, programFiles)
    const program = getProgramFromFiles(programFiles)
    console.log(
      options.allPaths.map(path => getTypesPathFromPath(path)).filter(typesPath => !fs.existsSync(typesPath)))
    options.gatherAllContext.generator = buildGenerator(program, {uniqueNames: false, required:true, typeOfKeyword: false, validationKeywords: ['deprecated'], titles: true, ref: true, aliasRef: false, topRef:false});
    options.gatherAllContext.program = program
  }
  const type = getTypeFromPath(path) + 'Props'
  const typesPath = getTypesPathFromPath(path)
  const fn = path.split('/').join('_')
  fs.writeFileSync('/home/jakutis/wsr/' + fn, fs.readFileSync(path))
  //console.log(path, tsFile, type)
  /*
  const begin1 = Date.now()
  try {
    const schema = createGenerator({
      path: tsFile,
    }).createSchema(type);
    //console.log(jsonStringify(schema))
    //console.log('1 SUCCESS TS PARSE')
    append('ts-json-schema-generator', 'pass', Date.now() - begin1, path, jsonStringify(schema))
  } catch (err) {
    //console.log('1 FAILED TS PARSE\n' + err.stack)
    append('ts-json-schema-generator', 'fail', Date.now() - begin1, path, err.message)
  }
  const begin2 = Date.now()
  try {
    const program = getProgramFromFiles(
      [tsFile],
    );
    const schema = generateSchema(program, type, {required:true});
    //console.log(jsonStringify(schema))
    //console.log('2 SUCCESS TS PARSE')
    append('typescript-json-schema', 'pass', Date.now() - begin2, path, jsonStringify(schema))
  } catch (err) {
    append('typescript-json-schema', 'fail', Date.now() - begin2, path, err.message)
    //console.log('2 FAILED TS PARSE\n' + err.stack)
  }
  */
  const begin3 = Date.now()
  let schema
  try {
    //console.log('symbols', symbolList)
    //console.log('select', symbolList[0].name)
    /*
    const symbols = options.gatherAllContext.generator.getSymbols(type);
    if (symbols.length !== 1) {
      console.log('non-single symbols for ' + type + ': ' + symbols.map(s => s.name))
    }
    schema = options.gatherAllContext.generator.getSchemaForSymbol(symbols[0].name);
    */
    schema = options.gatherAllContext.generator.getSchemaForSymbol(type);
    fs.writeFileSync('/home/jakutis/wsr/' + fn + '.schema.json', jsonStringify(schema, {space: 2}))
    fs.writeFileSync('/home/jakutis/wsr/' + fn + '.d.ts', fs.readFileSync(typesPath))
    //    append('typescript-json-schema-generator', 'pass', Date.now() - begin3, path, jsonStringify(schema))
    //console.log(jsonStringify(schema))
    //console.log('3 SUCCESS TS PARSE')
    console.log('PASS ' + fn)
  } catch (err) {
    console.log('FAIL ' + fn)
    console.log(err.stack)
    throw err
    /*
error getting schema of WixStyleReactProviderProps:
Error: type WixStyleReactProviderProps not found
    at JsonSchemaGenerator.getSchemaForSymbol (/home/jakutis/Desktop/Wix/DSM_2739_Parse_type_interfaces/typescript-json-schema/typescript-json-schema.ts:1472:19)
    at followProps (/home/jakutis/Desktop/Wix/DSM_2739_Parse_type_interfaces/wix-ui/packages/react-autodocs-utils/src/follow-props/index.js:161:49)
    at /home/jakutis/Desktop/Wix/DSM_2739_Parse_type_interfaces/wix-ui/packages/react-autodocs-utils/src/parser/index.js:9:33
    at async Promise.all (index 176)
    at generate (/home/jakutis/Desktop/Wix/DSM_2739_Parse_type_interfaces/wix-style-react/packages/wix-style-react/scripts/generate-autodocs-registry.js:59:3)
    */
    //console.log('fail', type)
    //console.log('error getting schema of ' + type + ':\n' + err.stack)
    //append('typescript-json-schema-generator', 'fail', Date.now() - begin3, path, err.message)
  }
  return parseDocgen({ source, path, options })
    // if resolved, no need to follow props, no need for .then
    // if rejected, need to follow props
    .catch((parsed) => {
      return followComposedProps(parsed, path, options).then(a => {
        fs.writeFileSync('/home/jakutis/wsr/' + fn + '.composed.json', jsonStringify(parsed, {space: 2}))
        return a
      })
    })
    .then(a => {
      Object.values(a.props).forEach(prop => {
        if (prop.type.name === 'enum') {
          if (Array.isArray(prop.type.value)) {
            prop.type.value.sort((a, b) => a.value > b.value ? 1 : -1)
          }
        }
      })
      fs.writeFileSync('/home/jakutis/wsr/' + fn + '.theirs.json', jsonStringify(a, {space: 2}))

      const setDescriptions = (aProps, bProps) => {
        Object.entries(bProps).forEach(([name, bValue]) => {
          const aValue = aProps[name]
          if (aValue) {
            bValue.description = bValue.description || aValue.description
            if (bValue.name === 'shape' && aValue.name === 'shape') {
              setDescriptions(aValue.value, bValue.value);
            }
          }
        })
      }
      debugger
      const c = jsonSchemaToDocgen({
        schema,
        fallbackDocgen: a
      })
      fs.writeFileSync('/home/jakutis/wsr/' + fn + '.merged.json', jsonStringify(c, {space: 2}))
      if (schema) {
        /*
        const schemaProps = Object.keys(schema.properties || [])
        const originalProps = Object.keys(a.props)
        const lines = []
        for (const a of schemaProps) {
          if (!originalProps.includes(a)) {
            lines.push('original does not have schema prop ' + a)
          }
        }
        for (const a of originalProps) {
          if (!schemaProps.includes(a)) {
            lines.push('schema does not have original prop ' + a)
          }
        }
        if (lines.length > 0) {
          lines.unshift('original props ' + originalProps.length)
          lines.unshift('schema props ' + schemaProps.length)
          console.log(path + ' parsing is different:\n' + lines.join('\n') + '\n')
        }
        */
      } else {
        //console.log(path + ' parsing failed\n')
      }
      return c
    })
    .catch((e) => console.log(`ERROR: Unable to handle composed props for Component at ${path}`, e));
}

module.exports = followProps;
