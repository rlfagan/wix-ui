/* global Promise */

const fs = require('fs')
const csvStringify = require('csv-stringify/lib/sync')
const { join: pathJoin, dirname: pathDirname } = require('path');
const { buildGenerator, getProgramFromFiles, generateSchema } = require('typescript-json-schema-jakutis');
//const { createGenerator } = require('ts-json-schema-generator');
const { reactDocgenParse } = require('../parser/react-docgen-parse');

const readFile = require('../read-file');
const followExports = require('../follow-exports');
const resolveNodeModules = require('../resolve-node-modules');

const convert = s => {
  const props = Object.entries(s.properties).reduce((props, [key, property]) => {
    const { description, originalType, $ref } = property
    const { deprecated, type: _type, enum: _enum, properties } = $ref ? s.definitions[$ref.substr('#/definitions/'.length)] : property
    const type = _enum ? {
      name: 'enum',
      value: _enum.map(e => ({value:JSON.stringify(e),computed:false}))
    } : {
      name: (originalType.startsWith('React.') || properties) ? originalType : _type
    }

    const resolvedDescription = description + (deprecated ? ('\n@deprecated ' + deprecated) : '')
    props[key] = {
      type,
      required: false,
      description: resolvedDescription,
    }
    return props;
  }, {})
  return {
    props
  }
}

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
    console.log('creating new')
    const program = getProgramFromFiles(
      options.allPaths.map(path => getTypesPathFromPath(path)).filter(typesPath => fs.existsSync(typesPath)),
    )
    console.log(
      options.allPaths.map(path => getTypesPathFromPath(path)).filter(typesPath => !fs.existsSync(typesPath)))
    options.gatherAllContext.generator = buildGenerator(program, {uniqueNames: false, required:true, typeOfKeyword: true, validationKeywords: ['deprecated'], titles: false, ref: true, aliasRef: false, topRef:false});
    options.gatherAllContext.program = program
  }
  const type = getTypeFromPath(path) + 'Props'
  const typesPath = getTypesPathFromPath(path)
  const fn = path.split('/').join('_')
  debugger
  //console.log(path, tsFile, type)
  /*
  const begin1 = Date.now()
  try {
    const schema = createGenerator({
      path: tsFile,
    }).createSchema(type);
    //console.log(JSON.stringify(schema, null, 2))
    //console.log('1 SUCCESS TS PARSE')
    append('ts-json-schema-generator', 'pass', Date.now() - begin1, path, JSON.stringify(schema))
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
    //console.log(JSON.stringify(schema, null, 2))
    //console.log('2 SUCCESS TS PARSE')
    append('typescript-json-schema', 'pass', Date.now() - begin2, path, JSON.stringify(schema))
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
    fs.writeFileSync('/home/jakutis/wsr/' + fn + '.schema.json', JSON.stringify(schema, null, 2))
    fs.writeFileSync('/home/jakutis/wsr/' + fn + '.d.ts', fs.readFileSync(typesPath))
    fs.writeFileSync('/home/jakutis/wsr/' + fn, fs.readFileSync(path))
    //    append('typescript-json-schema-generator', 'pass', Date.now() - begin3, path, JSON.stringify(schema))
    //console.log(JSON.stringify(schema, null, 2))
    //console.log('3 SUCCESS TS PARSE')
  } catch (err) {
    //console.log('fail', type)
    console.log('error getting schema of ' + type + ':\n' + err.stack)
    //append('typescript-json-schema-generator', 'fail', Date.now() - begin3, path, err.message)
  }
  return parseDocgen({ source, path, options })
    // if resolved, no need to follow props, no need for .then
    // if rejected, need to follow props
    .catch((parsed) => {
      return followComposedProps(parsed, path, options).then(a => {
        fs.writeFileSync('/home/jakutis/wsr/' + fn + '.composed.json', JSON.stringify(parsed, null, 2))
        return a
      })
    })
    .then(a => {
      fs.writeFileSync('/home/jakutis/wsr/' + fn + '.theirs.json', JSON.stringify(a, null, 2))
      fs.writeFileSync('/home/jakutis/wsr/' + fn + '.mine.json', JSON.stringify(convert(schema), null, 2))
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
        console.log(path + ' parsing failed\n')
      }
      return a
    })
    .catch((e) => console.log(`ERROR: Unable to handle composed props for Component at ${path}`, e));
}

module.exports = followProps;
