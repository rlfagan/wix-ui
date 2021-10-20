const {
  applyCodemod,
  STRATEGIES,
} = require('../common/rules/replace-old-stylable-imports');

const replacementsModel = {
  componentNamePattern: {
    regexp: /wix-ui-tpa\/dist\/src\/(.*\/)*(.*)\.st\.css/,
    groupNumberForComponentName: 2,
  },
  rules: [
    {
      strategy: STRATEGIES.REPLACE_WITH_COMPONENT_NAME_PREFIX,
      regexp: /wix-ui-tpa\/dist\/src\/(.*\/)*(.*)\.st\.css/,
      changeTo: 'wix-ui-tpa/index.st.css',
    },
    {
      regexp: /wix-ui-tpa\/dist\/src\/common\/formatters.st/,
      changeTo: 'wix-ui-tpa/style-processor-formatters',
    },
  ],
};

module.exports.codemods = [
  {
    id: 'replace imports',
    apply({ ast, postcss }) {
      // This var will give indication for our users for the changed files
      const isChanged = applyCodemod(ast, postcss, replacementsModel);

      return {
        changed: isChanged,
      };
    },
  },
];
