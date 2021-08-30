const jsonStringify = require('json-stable-stringify');

const stringify = value => typeof value ==='string' ? ('\'' + value + '\'') : jsonStringify(value);

const nodeTypes = ['Element', 'Document', 'ChildNode', 'HTMLElement', 'React.ReactText<any>', 'React.ReactText', 'React.ReactPortal<any>', 'React.ReactPortal', 'React.ReactFragment<any>', 'React.ReactFragment', 'React.ReactNodeArray<any>', 'React.ReactNodeArray', 'React.ReactChild<any>', 'React.ReactChild', 'React.ReactNode<any>', 'React.ReactNode', 'ShadowRoot', 'HTMLSlotElement'];

const elementTypes = ['React.ReactElement<any>', 'React.ReactElement'];

const elementTypeTypes = ['React.ComponentType<any>', 'React.ComponentType'];

const addToAnyOf = (anyOf, item) => {
  if (anyOf.findIndex(i => i.originalType === item.originalType) < 0) {
    return anyOf.concat([item]);
  }
  return anyOf;
};

const descriptionAndAnnotations = (description, annotations) => {
  if (!annotations.length) {
    return description;
  }
  const annotationsForDescription = annotations.map(({type, value}) => '@' + type + ' ' + value).join('\n');
  return (description ? (description + '\n') : '') + annotationsForDescription;
};

const mergeProperties = (target, source, override) => {
  Object.entries(source || {}).forEach(([key, _source]) => {
    const _target = target[key];
    if (!override && key in target && jsonStringify(_source) !== jsonStringify(_target)) {
      if (!_target.originalType) {
        throw new Error('VYTAS3\n'+JSON.stringify(_source)+'\n'+JSON.stringify(_target));
      }
      if (!_source.originalType) {
        throw new Error('VYTAS2\n'+JSON.stringify(_source)+'\n'+JSON.stringify(_target));
      }
      if ((_source.anyOf && _target.enum) || (_source.enum && _target.anyOf) || (_source.type === _target.type && _source.originalType.startsWith('React.') && _target.originalType.startsWith('React.'))) {
        target[key] = {
          anyOf: addToAnyOf([ {originalType: _target.originalType}, ], {originalType: _source.originalType}),
          mergedAnyOf: true,
          originalType: _target.originalType + ' or ' + _source.originalType
        };
      } else if (_source.mergedAnyOf) {
        target[key] = {
          anyOf: addToAnyOf(_source.anyOf, {originalType: _target.originalType}),
          mergedAnyOf: true,
          originalType: _target.originalType + ' or ' + _source.originalType
        };
      } else if (_target.mergedAnyOf) {
        target[key] = {
          anyOf: addToAnyOf(_target.anyOf, {originalType: _source.originalType}),
          mergedAnyOf: true,
          originalType: _target.originalType + ' or ' + _source.originalType
        };
      } else if (_source.type === _target.type && _source.enum && _target.enum) {
        target[key] = {
          type: _source.type,
          enum: _source.enum.concat(_target.enum),
          originalType: _target.originalType + ' or ' + _source.originalType
        };
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
        };
      } else if (_source.type === _target.type && _source.originalType.startsWith('React.') && _target.originalType === '() => void') {
        target[key] = {
          type: _source.type,
          originalType: _source.originalType
        };
      } else {
        throw new Error([
          'VYTAS how to merge?',
          key,
          JSON.stringify(_source, null, 2),
          JSON.stringify(_target, null, 2),
        ].join('\n'));
      }
    } else {
      target[key] = _source;
    }
  });
};

const convertToType = (s, ctx) => {
  const { descriptions = {}, visitedDefinitions = [] } = ctx;
  // TODO test deprecated
  const { deprecated, description: _description, originalType, $ref } = s;
  const description = _description || descriptions.description;
  const definitionName = $ref && $ref.substr('#/definitions/'.length);
  if (definitionName && visitedDefinitions.includes(definitionName)) {
    return {
      name: definitionName,
      description,
    };
  }
  const subCtx = Object.assign({}, ctx, {
    descriptions: descriptions.descriptions,
    visitedDefinitions: visitedDefinitions.concat(definitionName || [])
  });
  const isNodeType = nodeTypes.includes(definitionName) || nodeTypes.includes(originalType);
  const isElementType = elementTypes.includes(definitionName) || elementTypes.includes(originalType);
  const isElementTypeType = elementTypeTypes.includes(definitionName) || elementTypeTypes.includes(originalType);
  const isReactType = originalType && originalType.startsWith('React.');
  const isFunctionType = originalType === 'Function' || originalType === '() => void';
  const isObjectType = definitionName === 'Object';
  s = definitionName && !isElementType && !isElementTypeType && !isNodeType && !isReactType && !isFunctionType ? ctx.definitions[definitionName] : s;
  const { enum: _enum, properties, anyOf, allOf, type: _name } = s;
  if (Array.isArray(_name)) {
    return {
      name: 'union',
      value: _name.map(name => ({ name })),
      description
    };
  }

  const name = isNodeType ? 'node' :
    isElementType ? 'element' :
      isElementTypeType ? 'elementType' :
        isReactType ? originalType :
          isFunctionType ? 'func' :
            (_name === 'boolean') ? 'bool' :
              _enum ? 'enum' :
                (isObjectType || (properties && Object.keys(properties).length === 0)) ? 'object' :
                  (properties || anyOf && anyOf.every(i => i.allOf)) ? 'shape' :
                    anyOf ? 'union' :
                      allOf ? 'shape' :
                        _name === 'array' ? (Object.keys(s.items).length === 0 ? 'array' : 'arrayOf') :
                          ['string', 'number'].includes(_name) ? _name : 
                            (_name === undefined || (_name === 'object' && !properties)) ? (originalType || 'object') : undefined;
  if (name === undefined) {
    debugger;
    throw new Error('undefined name\n' + JSON.stringify(s, null, 2));
  }

  const shape = name === 'shape' ? convertToProperties(s, Object.assign({}, subCtx, {shape: true})) : {};
  const value = name === 'enum' ? _enum.map(e => ({value: stringify(e), computed:false})) :
    name === 'union' ? s.anyOf
      .filter(i => i.type !== 'object' || (i.type === 'object' && i.properties))
      .map(s => convertToType(s, subCtx)) :
      name === 'arrayOf' ? convertToType(s.items, subCtx) :
        name === 'shape' ? shape.properties : undefined;
  const annotations = (shape.annotations || [])
    .concat(deprecated ? {type: 'deprecated', value: deprecated} : [])
    .concat((definitionName && !['func', 'bool', 'node', 'element', 'elementType', 'object'].includes(name)) ? {type: 'definition', value: definitionName} : []);
  const annotatedDescription = descriptionAndAnnotations(description, annotations);

  if (name === 'shape' && Object.keys(value).length === 0) {
    return {
      name: 'object',
      description: annotatedDescription,
    };
  }
  return {
    name,
    value,
    description: annotatedDescription,
  };
};

const mergeForProperties = (s, ctx) => {
  if (s.allOf) {
    return s.allOf
      .flatMap(_s => _s.allOf ? _s.allOf : [_s])
      .reduce((_s, item) => {
        if (item.$ref) {
          const definitionName = item.$ref.substr('#/definitions/'.length);
          if (definitionName === 'Object' || definitionName === 'Function') {
            return _s;
          } else if (definitionName.startsWith('React.')) {
            _s.annotations = _s.annotations.concat({type: s.allOfOverrides ? 'maybeInheritsPropsOf' : 'inheritsPropsOf', value: definitionName});
            return _s;
          } else {
            item = ctx.definitions[definitionName];
          }
        }
        if (item.type !== 'object') {
          debugger;
          throw new Error('expected schema.allOf array item type ' + item.type + ' to be object\n'+JSON.stringify(item, null, 2) + '\n'+JSON.stringify(_s, null, 2) + '\n'+JSON.stringify(s, null, 2));
        }
        mergeProperties(_s.properties, item.properties, s.allOfOverrides);
        _s.required = _s.required.concat(item.required);
        return _s;
      }, {properties:{}, required:[], annotations: []});
  }
  if (s.anyOf) {
    return s.anyOf.map(s => mergeForProperties(s, ctx)).reduce((s, _s) => {
      mergeProperties(s.properties, _s.properties);
      s.required = s.required.concat(_s.required);
      s.annotations = s.annotations.concat(_s.annotations);
      return s;
    }, {properties:{}, required:[], annotations: []});
  }
  return s;
};

const convertToProperties = (s, {definitions = s.definitions, shape = false, descriptions = {}, visitedDefinitions} = {}) => {
  const { properties, required = [], annotations = [] } = mergeForProperties(s, {definitions, visitedDefinitions, descriptions});

  return {
    annotations,
    properties: Object.entries(properties).reduce((props, [key, s]) => {
      const { name, value, description } = convertToType(s, {definitions, visitedDefinitions, descriptions: descriptions[key]});
      props[key] = {
        required: required.includes(key),
        description
      };
      if (shape) {
        props[key].name = name;
        props[key].value = value;
      } else {
        props[key].type = {name, value};
      }
      return props;
    }, {})
  };
};

const createDescriptions = (props) => {
  return Object.entries(props).reduce((descriptions, [name, value]) => {
    descriptions[name] = {
      description: value.description,
      descriptions: createDescriptions((value.name === 'shape') ? value.value : (value.type && value.type.name === 'shape') ? value.type.value : {})
    };
    return descriptions;
  }, {});
};

const convert = ({schema, fallbackDocgen = {}}) => {
  const fallbackDocgenProps = fallbackDocgen.props || {};
  const descriptions = createDescriptions(fallbackDocgenProps);
  const {properties: props = {}, annotations = []} = schema ? convertToProperties(schema, {descriptions}) : {};

  Object.entries(props).forEach(([name, bValue]) => {
    const aValue = fallbackDocgenProps[name];
    if (aValue) {
      bValue.defaultValue = aValue.defaultValue;
    }
  });

  return {
    description: descriptionAndAnnotations(fallbackDocgen.description, annotations),
    displayName: fallbackDocgen.displayName,
    methods: fallbackDocgen.methods,
    context: fallbackDocgen.context,
    props: props || fallbackDocgen.props
  };
};

module.exports = convert;
