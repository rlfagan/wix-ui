const jsonStringify = require('json-stable-stringify');

const stringify = value => typeof value ==='string' ? ('\'' + value + '\'') : jsonStringify(value);

const nodeTypes = ['Element', 'Document', 'ChildNode', 'HTMLElement', 'React.ReactText<any>', 'React.ReactText', 'React.ReactPortal<any>', 'React.ReactPortal', 'React.ReactFragment<any>', 'React.ReactFragment', 'React.ReactNodeArray<any>', 'React.ReactNodeArray', 'React.ReactChild<any>', 'React.ReactChild', 'React.ReactNode<any>', 'React.ReactNode', 'ShadowRoot', 'HTMLSlotElement'];

const elementTypes = ['React.ReactElement<any>', 'React.ReactElement'];

const elementTypeTypes = ['React.ComponentType<any>', 'React.ComponentType', 'React.ComponentClass<any,any>', 'React.ComponentClass', 'React.VoidFunctionComponent<any>', 'React.VoidFunctionComponent', 'React.FunctionComponent<any>', 'React.FunctionComponent', 'React.FunctionComponent<any>', 'React.FunctionComponent'];

const isNodeType = (typ) => typ && (nodeTypes.includes(typ) || typ.startsWith('HTML') || typ.startsWith('Partial<HTML'));

const isReactType = (typ) => typ && typ.startsWith('React.');

const isElementType = (typ) => elementTypes.includes(typ);

const isElementTypeType = (typ) => elementTypeTypes.includes(typ);

const isFunctionType = (typ) => typ === 'Function' || typ === '() => void';

const isObjectType = (typ) => typ === 'Object';

const shouldExpand = (typ) => !isElementType(typ) && !isElementTypeType(typ) && !isNodeType(typ) && !isReactType(typ) && !isFunctionType(typ);

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
        throw new Error('VYTAS3\n');//+JSON.stringify(_source)+'\n'+JSON.stringify(_target));
      }
      if (!_source.originalType) {
        throw new Error('VYTAS2\n');//+JSON.stringify(_source)+'\n'+JSON.stringify(_target));
      }
      if ((_source.anyOf && _target.enum) || (_source.enum && _target.anyOf) || (_source.type === _target.type && isReactType(_source.originalType) && isReactType(_target.originalType))) {
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
      } else if (_source.type === _target.type && _source.originalType === '() => void' && isReactType(_target.originalType)) {
        target[key] = {
          type: _source.type,
          originalType: _target.originalType
        };
      } else if (_source.type === _target.type && isReactType(_source.originalType) && _target.originalType === '() => void') {
        target[key] = {
          type: _source.type,
          originalType: _source.originalType
        };
      } else if (_source.originalType && _target.originalType) {
        target[key] = {
          anyOf: [_source, _target],
          mergedAnyOf: true,
          originalType: _target.originalType + ' or ' + _source.originalType
        };
      } else {
        debugger;
        throw new Error([
          'VYTAS how to merge?',
          key,
          //JSON.stringify(_source, null, 2),
          //JSON.stringify(_target, null, 2),
        ].join('\n'));
      }
    } else {
      target[key] = _source;
    }
  });
};

const convertToType = (s, ctx) => {
  const { descriptions = {}, visitedDefinitions = [], depth = 0 } = ctx;
  if (depth > 10) {
    debugger;
  }
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
    depth: depth + 1,
    descriptions: descriptions.descriptions,
    visitedDefinitions: visitedDefinitions.concat(definitionName || [])
  });
  const _isNodeType = isNodeType(definitionName) || isNodeType(originalType);
  const _isElementType = isElementType(definitionName) || isElementType(originalType);
  const _isElementTypeType = isElementTypeType(definitionName) || isElementTypeType(originalType);
  const _isReactType = isReactType(definitionName) || isReactType(originalType);
  const _isFunctionType = isFunctionType(definitionName) || isFunctionType(originalType);
  const _isObjectType = isObjectType(definitionName) || isObjectType(originalType);
  s = definitionName && shouldExpand(definitionName) ? ctx.definitions[definitionName] : s;
  const { enum: _enum, properties, anyOf, allOf, type: _name } = s;
  if (Array.isArray(_name)) {
    return {
      name: 'union',
      value: _name.map(name => ({ name })),
      description
    };
  }

  const name = _isNodeType ? 'node' :
    _isElementType ? 'element' :
      _isElementTypeType ? 'elementType' :
        _isReactType ? (originalType || definitionName) :
          _isFunctionType ? 'func' :
            (_name === 'boolean') ? 'bool' :
              _enum ? 'enum' :
                (_isObjectType || (properties && Object.keys(properties).length === 0)) ? 'object' :
                  (properties || anyOf && anyOf.every(i => i.allOf)) ? 'shape' :
                    anyOf ? 'union' :
                      allOf ? 'shape' :
                        _name === 'array' ? (Object.keys(s.items).length === 0 ? 'array' : 'arrayOf') :
                          ['string', 'number'].includes(_name) ? _name : 
                            (_name === undefined || (_name === 'object' && !properties)) ? (originalType || definitionName || 'object') : undefined;
  if (name === undefined) {
    debugger;
    throw new Error('undefined name\n' + JSON.stringify(s, null, 2));
  }

  const shape = name === 'shape' ? convertToProperties(s, Object.assign({}, subCtx, {shape: true})) : {};
  const value = name === 'enum' ? _enum.map(e => ({value: stringify(e), computed:false})) :
    name === 'union' ? s.anyOf
      .filter(i => i.type !== 'object' || (i.type === 'object' && (i.properties || i.originalType)))
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

const flattenAllOf = (s, ctx, d = 0) => {
  if (d > 10) {
    debugger;
  }
  if (s.$ref) {
    const definitionName = s.$ref.substr('#/definitions/'.length);
    if (definitionName === 'Object' || definitionName === 'Function') {
      return {
        items: [],
        annotations: []
      };
    } else if (isReactType(definitionName)) {
      return {
        items: [],
        annotations: [{type: s.allOfOverrides ? 'maybeInheritsPropsOf' : 'inheritsPropsOf', value: definitionName}]
      };
    } else {
      if (shouldExpand(definitionName)) {
        return flattenAllOf(ctx.definitions[definitionName], ctx, d + 1);
      } else {
        return {
          items: [{
            originalType: definitionName,
            type: 'object'
          }],
          annotations: []
        };
      }
    }
  } else if (s.allOf) {
    return s.allOf.reduce((result, _s) => {
      if (_s.$ref || _s.allOf) {
        const { items, annotations } = flattenAllOf(_s, ctx, d + 1);
        result.items = result.items.concat(items);
        result.annotations = result.annotations.concat(annotations);
      } else {
        result.items = result.items.concat(_s);
      }
      return result;
    }, {
      items: [],
      annotations: []
    });
  } else {
    return {
      items: [s],
      annotations: []
    };
  }
};

const mergeForProperties = (s, ctx, depth = 0) => {
  if (depth > 10) {
    debugger;
  }
  // TODO fix required field value bugs - find a more correct way to merge required array below
  if (s.$ref) {
    const definitionName = s.$ref.substr('#/definitions/'.length);
    if (shouldExpand(definitionName)) {
      s = ctx.definitions[definitionName];
    } else {
      s = {
        originalType: definitionName,
        type: 'object'
      };
    }
  }
  if (s.allOf) {
    const { items, annotations } = flattenAllOf(s, ctx);
    return items
      .reduce((_s, item) => {
        if (item.type !== 'object') {
          debugger;
          throw new Error('expected schema.allOf array item type ' + item.type + ' to be object\n');//+JSON.stringify(item, null, 2) + '\n'+JSON.stringify(_s, null, 2) + '\n'+JSON.stringify(s, null, 2));
        }
        mergeProperties(_s.properties, item.properties, s.allOfOverrides);
        _s.required = _s.required.concat(item.required);
        return _s;
      }, {properties:{}, required:[], annotations});
  }
  if (s.anyOf) {
    return s.anyOf.map(s => mergeForProperties(s, ctx, depth + 1)).reduce((s, _s) => {
      mergeProperties(s.properties, _s.properties);
      s.required = s.required.concat(_s.required);
      s.annotations = s.annotations.concat(_s.annotations);
      return s;
    }, {properties:{}, required:[], annotations: []});
  }
  const { properties = {}, required = [], annotations = [] } = s;
  return {
    properties,
    required,
    annotations
  };
};

const convertToProperties = (s, ctx) => {
  const { descriptions = {} } = ctx;
  const { properties, required, annotations } = mergeForProperties(s, ctx);

  return {
    annotations,
    properties: Object.entries(properties).reduce((props, [key, s]) => {
      const subCtx = Object.assign({}, ctx, {
        descriptions: descriptions[key],
      });
      const { name, value, description } = convertToType(s, subCtx);
      props[key] = {
        required: required.includes(key),
        description
      };
      if (ctx.shape) {
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
  debugger;
  const {properties: props = {}, annotations = []} = schema ? convertToProperties(schema, {descriptions, definitions: schema.definitions}) : {};

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
