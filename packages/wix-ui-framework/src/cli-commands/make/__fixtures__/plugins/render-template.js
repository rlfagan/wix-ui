const path = require('path');

module.exports = async ({ components }, { renderTemplate, cwd, output }) => {
  await components.reduce(async (promise, component) => {
    await promise;
    const data = {
      greeting: component.name === 'ComponentA' ? 'Batman' : 'Robin',
    };

    const templatePath = path.join(
      cwd,
      'template',
      'from',
      'nested',
      'folder.ejs',
    );

    await renderTemplate({
      templatePath,
      output: path.join(output, component.name),
      data,
    });

  }, Promise.resolve());
};
