import {
  Transform,
  JSXOpeningElement,
  JSXAttribute,
  JSXIdentifier,
  StringLiteral,
} from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

type RenameInterface = {
  from: { prop: string; value?: string };
  to: { prop: string; value?: string };
};

type RemoveInterface = {
  prop: string;
  value?: string;
};

const propertiesUpdates = {
  Input: {
    rename: [
      {
        from: { prop: 'size', value: 'normal' },
        to: { prop: 'size', value: 'medium' },
      },
      {
        from: { prop: 'roundInput' },
        to: { prop: 'border', value: 'round' },
      },
    ],
  },
  InputArea: {
    rename: [
      {
        from: { prop: 'size', value: 'normal' },
        to: { prop: 'size', value: 'medium' },
      },
    ],
  },
  MarketingLayout: {
    remove: [
      {
        prop: 'size',
        value: 'large',
      },
    ],
  },
  RadioGroup: {
    remove: [
      {
        prop: 'lineHeight',
      },
    ],
  },
  AutoComplete: {
    rename: [
      {
        from: { prop: 'roundInput' },
        to: { prop: 'border', value: 'round' },
      },
    ],
  },
  Dropdown: {
    rename: [
      {
        from: { prop: 'roundInput' },
        to: { prop: 'border', value: 'round' },
      },
    ],
  },
  MultiSelect: {
    rename: [
      {
        from: { prop: 'roundInput' },
        to: { prop: 'border', value: 'round' },
      },
    ],
  },
  MultiSelectCheckbox: {
    rename: [
      {
        from: { prop: 'roundInput' },
        to: { prop: 'border', value: 'round' },
      },
    ],
  },
  NumberInput: {
    rename: [
      {
        from: { prop: 'roundInput' },
        to: { prop: 'border', value: 'round' },
      },
    ],
  },
  Search: {
    rename: [
      {
        from: { prop: 'roundInput' },
        to: { prop: 'border', value: 'round' },
      },
    ],
  },
};

const renamedComponents = [
  {
    originalName: 'TimeInputNext',
    newName: 'TimeInput',
  },
  {
    originalName: 'SortableList',
    newName: 'SortableListBase',
  },
  {
    originalName: 'StyledNestableList',
    newName: 'NestableList',
  },
];

const transform: Transform = (file, api, { backwardsCompatibleOnly }) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  const findWSRImport = () =>
    root.find(j.ImportDeclaration, {
      source: {
        value: 'wix-style-react',
      },
    });

  const findWSRComponentImport = (name: string) =>
    findWSRImport().find(j.ImportSpecifier, {
      imported: { name },
    });

  const findImportedWSRComponentLocalName = (name: string) => {
    const nodes = findWSRImport()
      .find(j.ImportSpecifier, {
        imported: { name },
      })
      .nodes();

    return nodes.length ? nodes[0].local.name : null;
  };

  const findOpeningTagPaths = (name: string) => {
    const localName = findImportedWSRComponentLocalName(name);
    return localName
      ? root.find(j.JSXOpeningElement, { name: { name: localName } })
      : [];
  };

  const executeRename = (
    props: JSXAttribute[],
    attribute: JSXAttribute,
    rule: RenameInterface,
  ) => {
    // if consumer wants to replace just prop name and maybe add different value
    if (!rule.from.value) {
      attribute.name.name = rule.to.prop;
      if (rule.to.value) {
        attribute.value = j.stringLiteral(rule.to.value);
      }
      props.push(attribute);
      return props;
    }

    // if consumer wants to search based on value too
    if (rule.from.value) {
      // property is truthy
      if (attribute.value === null) {
        attribute.name.name = rule.to.prop;
        attribute.value = j.stringLiteral(rule.to.value);
        props.push(attribute);
        return props;
      }

      // value is a string literal
      if (j.Literal.check(attribute.value)) {
        if (attribute.value.value === rule.from.value) {
          attribute.name.name = rule.to.prop;
          attribute.value = j.stringLiteral(rule.to.value);
          props.push(attribute);
          return props;
        }
      }

      // value is a JSXExpressionContainer with string literal
      if (j.JSXExpressionContainer.check(attribute.value)) {
        if (j.Literal.check(attribute.value.expression)) {
          if (attribute.value.expression.value === rule.from.value) {
            attribute.name.name = rule.to.prop;
            attribute.value = j.stringLiteral(rule.to.value);
            props.push(attribute);
            return props;
          }
        }
      }
    }

    // if attribute does not match instructions just return as is
    props.push(attribute);
    return props;
  };

  const executeRemove = (
    props: JSXAttribute[],
    attribute: JSXAttribute,
    rule: RemoveInterface,
  ) => {
    // In case user just want blindly remove the prop
    if (!rule.value && rule.prop === attribute.name.name) {
      return props;
    }

    // In case user wants to delete the prop with certain value attached
    if (rule.value) {
      // property is truthy
      if (attribute.value === null) {
        return props;
      }

      // value is a string literal
      if (j.Literal.check(attribute.value)) {
        if (attribute.value.value === rule.value) {
          return props;
        }
      }

      // value is a JSXExpressionContainer with string literal
      if (j.JSXExpressionContainer.check(attribute.value)) {
        if (j.Literal.check(attribute.value.expression)) {
          if (attribute.value.expression.value === rule.value) {
            return props;
          }
        }
      }
    }

    // if attribute does not match rule just return as is
    props.push(attribute);
    return props;
  };

  const updateProperty = ({
    paths,
    rename = [],
    remove = [],
  }: {
    paths: Collection<JSXOpeningElement>;
    rename?: RenameInterface[];
    remove?: RemoveInterface[];
  }) => {
    return paths.forEach((path) => {
      (path.node as JSXOpeningElement).attributes = (path.node as JSXOpeningElement).attributes.reduce(
        (props: JSXAttribute[], attribute: JSXAttribute) => {
          // checking if there ys any jsx attribute
          if (j.JSXAttribute.check(attribute)) {
            // check if consumer wants a rename of this attribute
            const renameRule = rename.find(
              ({ from }) => from.prop === attribute.name.name,
            );
            if (renameRule) {
              return executeRename(props, attribute, renameRule);
            }

            // check if consumer wants a remove of this attribute
            const removeRule = remove.find(
              ({ prop }) => prop === attribute.name.name,
            );
            if (removeRule) {
              return executeRemove(props, attribute, removeRule);
            }
          }

          return props;
        },
        [],
      );
    });
  };

  const removeFontUpgrade = () => {
    const componentName = 'FontUpgrade';

    const fontUpgradeNodes = findWSRComponentImport(componentName).length
      ? root.find(j.JSXElement, {
          openingElement: {
            name: {
              name: findImportedWSRComponentLocalName(componentName),
            },
          },
        })
      : [];

    fontUpgradeNodes.forEach((path) => {
      const asProp: JSXAttribute | undefined = (path.node.openingElement
        .attributes as JSXAttribute[]).find((attr) => attr.name.name === 'as');
      const elementName: string = j.JSXAttribute.check(asProp)
        ? (asProp.value as StringLiteral).value
        : '';
      (path.node.openingElement.name as JSXIdentifier).name = elementName;
      (path.node.closingElement.name as JSXIdentifier).name = elementName;
      path.node.openingElement.attributes = [];
    });

    findWSRComponentImport(componentName).forEach((path) => {
      path.prune();
    });

    findWSRImport().forEach((importPath) => {
      if (!importPath.value.specifiers.length) {
        importPath.prune();
      }
    });
  };

  const updateComponentsProperties = () => {
    Object.entries(propertiesUpdates).forEach(([component, update]) => {
      const paths = findOpeningTagPaths(
        component,
      ) as Collection<JSXOpeningElement>;

      if (paths) {
        updateProperty({ paths, ...update });
      }
    });
  };

  const renameComponents = () => {
    renamedComponents.forEach(({ originalName, newName }) => {
      const componentTagExists = root.find(j.JSXOpeningElement, {
        name: { name: originalName },
      }).length;

      if (componentTagExists) {
        findOpeningTagPaths(originalName).forEach((path) => {
          (path.node.name as JSXIdentifier).name = newName;
        });
      }

      findWSRComponentImport(originalName).forEach((path) => {
        path.node.imported.name = newName;
      });
    });
  };

  updateComponentsProperties();

  if (!backwardsCompatibleOnly) {
    renameComponents();
    removeFontUpgrade();
  }

  return root.toSource({
    reuseWhitespace: true,
  });
};

export default transform;
