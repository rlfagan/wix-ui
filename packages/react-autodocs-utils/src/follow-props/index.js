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

const stringify = value => typeof value ==='string' ? ('\'' + value + '\'') : jsonStringify(value)

const nodeTypes = ['Element', 'Document', 'ChildNode', 'HTMLElement', 'React.ReactText<any>', 'React.ReactText', 'React.ReactPortal<any>', 'React.ReactPortal', 'React.ReactFragment<any>', 'React.ReactFragment', 'React.ReactNodeArray<any>', 'React.ReactNodeArray', 'React.ReactChild<any>', 'React.ReactChild', 'React.ReactNode<any>', 'React.ReactNode', 'ShadowRoot', 'HTMLSlotElement'];

const elementTypes = ['React.ReactElement<any>', 'React.ReactElement'];

const elementTypeTypes = ['React.ComponentType<any>', 'React.ComponentType'];

const addToAnyOf = (anyOf, item) => {
  if (anyOf.findIndex(i => i.originalType === item.originalType) < 0) {
    return anyOf.concat([item])
  }
  return anyOf
}

const descriptionAndAnnotations = (description, annotations) => {
  if (!annotations.length) {
    return description
  }
  const annotationsForDescription = annotations.map(({type, value}) => '@' + type + ' ' + value).join('\n')
  return (description ? (description + '\n') : '') + annotationsForDescription
}

const mergeProperties = (target, source) => {
  // TODO do not loose other fields like description
  Object.entries(source).forEach(([key, _source]) => {
    const _target = target[key]
    if (key in target && jsonStringify(_source) !== jsonStringify(_target)) {
        if (!_target.originalType) {
          throw new Error('VYTAS3\n'+JSON.stringify(_source)+'\n'+JSON.stringify(_target))
        }
        if (!_source.originalType) {
          throw new Error('VYTAS2\n'+JSON.stringify(_source)+'\n'+JSON.stringify(_target))
        }
      if ((_source.anyOf && _target.enum) || (_source.enum && _target.anyOf) || (_source.type === _target.type && _source.originalType.startsWith('React.') && _target.originalType.startsWith('React.'))) {
        target[key] = {
          anyOf: addToAnyOf([ {originalType: _target.originalType}, ], {originalType: _source.originalType}),
          mergedAnyOf: true,
          originalType: _target.originalType + ' or ' + _source.originalType
        }
      } else if (_source.mergedAnyOf) {
        target[key] = {
          anyOf: addToAnyOf(_source.anyOf, {originalType: _target.originalType}),
          mergedAnyOf: true,
          originalType: _target.originalType + ' or ' + _source.originalType
        }
      } else if (_target.mergedAnyOf) {
        target[key] = {
          anyOf: addToAnyOf(_target.anyOf, {originalType: _source.originalType}),
          mergedAnyOf: true,
          originalType: _target.originalType + ' or ' + _source.originalType
        }
      } else if (_source.type === _target.type && _source.enum && _target.enum) {
        target[key] = {
          type: _source.type,
          enum: _source.enum.concat(_target.enum),
          originalType: _target.originalType + ' or ' + _source.originalType
        }
      /*
      } else if (_source.type === 'union' && _target.type === 'union') {
        target[key] = {
          type: 'union',
          value: _target.value.reduce((value, item) => addToAnyOf(value, item), source.value)
        }
      } else if (_source.type === 'union') {
        if (!_source.originalType) {
          throw new Error('VYTAS1')
        }
        target[key] = {
          type: 'union',
          value: addToAnyOf(_source.value, {
            name: _target.originalType
          })
        }
      } else if (_target.type === 'union') {
        if (!_source.originalType) {
          throw new Error('VYTAS0')
        }
        target[key] = {
          type: 'union',
          value: addToAnyOf(_target.value, {
            name: _source.originalType
          })
        }
      */
      } else if (_source.type === _target.type && _source.originalType === '() => void' && _target.originalType.startsWith('React.')) {
        target[key] = {
          type: _source.type,
          originalType: _target.originalType
        }
      } else if (_source.type === _target.type && _source.originalType.startsWith('React.') && _target.originalType === '() => void') {
        target[key] = {
          type: _source.type,
          originalType: _source.originalType
        }
      } else {
        throw new Error([
          'VYTAS how to merge?',
          key,
          JSON.stringify(_source, null, 2),
          JSON.stringify(_target, null, 2),
        ].join('\n'))
      }
    } else {
      target[key] = _source
    }
  })
}

const convertToType = (s, ctx) => {
  const { descriptions = {} } = ctx
  const subCtx = Object.assign({}, ctx, {descriptions: descriptions.descriptions})
  // TODO test deprecated
  const { deprecated, description: _description, originalType, $ref } = s
  const description = _description || descriptions.description
  const definitionName = $ref && $ref.substr('#/definitions/'.length)
  const isNodeType = nodeTypes.includes(definitionName) || nodeTypes.includes(originalType)
  const isElementType = elementTypes.includes(definitionName) || elementTypes.includes(originalType)
  const isElementTypeType = elementTypeTypes.includes(definitionName) || elementTypeTypes.includes(originalType)
  const isReactType = originalType && originalType.startsWith('React.')
  s = definitionName && !isElementType && !isElementTypeType && !isNodeType && !isReactType ? ctx.definitions[definitionName] : s
  const { enum: _enum, properties, anyOf, allOf, type: _name } = s
  if (Array.isArray(_name)) {
    return {
      name: 'union',
      value: _name.map(name => ({ name })),
      description
    }
  }

  const name = isNodeType ? 'node' :
      isElementType ? 'element' :
      isElementTypeType ? 'elementType' :
      isReactType ? originalType :
      (_name === 'boolean') ? 'bool' :
      _enum ? 'enum' :
      (properties || anyOf && anyOf.every(i => i.allOf)) ? 'shape' :
      anyOf ? 'union' :
      allOf ? 'shape' :
      _name === 'array' ? 'arrayOf' :
      ['string', 'number'].includes(_name) ? _name : 
      (_name === undefined || (_name === 'object' && !properties)) ? (originalType === '() => void' ? 'func' : originalType) : undefined
  if (name === undefined) {
    throw new Error('undefined name\n' + JSON.stringify(s, null, 2))
  }

  const shape = name === 'shape' ? convertToProperties(s, Object.assign({}, subCtx, {shape: true})) : {}
  const value = name === 'enum' ? _enum.map(e => ({value: stringify(e), computed:false})) :
      name === 'union' ? s.anyOf
        .filter(i => i.type !== 'object' || (i.type === 'object' && i.properties))
        .map(s => convertToType(s, subCtx)) :
      name === 'arrayOf' ? convertToType(s.items, subCtx) :
      name === 'shape' ? shape.properties : undefined
  const annotations = (shape.annotations || []).concat(deprecated ? {type: 'deprecated', value: deprecated} : [])

  return {
    name,
    value,
    description: descriptionAndAnnotations(description, annotations),
  }
}

const mergeForProperties = (s, ctx) => {
  if (s.allOf) {
    return s.allOf
      .flatMap(_s => _s.allOf ? _s.allOf : [_s])
      .reduce((_s, item) => {
        if (item.$ref) {
          const definitionName = item.$ref.substr('#/definitions/'.length)
          if (definitionName.startsWith('React.')) {
            _s.annotations = _s.annotations.concat({type: 'inheritsPropsOf', value: definitionName})
            return _s;
          } else {
            item = ctx.definitions[definitionName]
          }
        }
        if (item.type !== 'object') {
          debugger
          throw new Error('expected schema.allOf array item type ' + item.type + ' to be object\n'+JSON.stringify(item, null, 2) + '\n'+JSON.stringify(_s, null, 2) + '\n'+JSON.stringify(s, null, 2))
        }
        mergeProperties(_s.properties, item.properties)
        _s.required = _s.required.concat(item.required)
        return _s;
      }, {properties:{}, required:[], annotations: []})
  }
  if (s.anyOf) {
    return s.anyOf.map(s => mergeForProperties(s, ctx)).reduce((s, _s) => {
      mergeProperties(s.properties, _s.properties)
      s.required = s.required.concat(_s.required)
      s.annotations = s.annotations.concat(_s.annotations)
      return s
    }, {properties:{}, required:[], annotations: []})
  }
  return s
}

const convertToProperties = (s, {definitions = s.definitions, shape = false, descriptions = {}} = {}) => {
  const { properties, required = [], annotations = [] } = mergeForProperties(s, {definitions, descriptions})

  return {
    annotations,
    properties: Object.entries(properties).reduce((props, [key, s]) => {
      const { name, value, description } = convertToType(s, {definitions, descriptions: descriptions[key]});
      props[key] = {
        required: required.includes(key),
        description
      }
      if (shape) {
        props[key].name = name
        props[key].value = value
      } else {
        props[key].type = {name, value}
      }
      return props;
    }, {})
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
      const createDescriptions = (props) => {
        return Object.entries(props).reduce((descriptions, [name, value]) => {
          descriptions[name] = {
            description: value.description,
            descriptions: createDescriptions((value.name === 'shape') ? value.value : (value.type && value.type.name === 'shape') ? value.type.value : {})
          }
          return descriptions
        }, {})
      }
      debugger
      const descriptions = createDescriptions(a.props)
      const {properties: props = {}, annotations = []} = schema ? convertToProperties(schema, {descriptions}) : {}
      const b = {
        props
      }

      Object.entries(b.props).forEach(([name, bValue]) => {
        const aValue = a.props[name]
        if (aValue) {
          bValue.defaultValue = aValue.defaultValue
        }
      });

      fs.writeFileSync('/home/jakutis/wsr/' + fn + '.mine.json', jsonStringify(b, {space: 2}))
      const c = {
        description: descriptionAndAnnotations(a.description, annotations),
        displayName: a.displayName,
        methods: a.methods,
        context: a.context,
        props: b.props || a.props
      }
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
