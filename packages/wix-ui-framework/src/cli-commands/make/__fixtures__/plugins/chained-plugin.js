const path = require('path');

const plugin1 = (data, api) => {
  return {
    dataFromPlugin1: data.components.length,
    cwd: api.cwd,
  };
};

const plugin2 = async (data, api) => {
  await api.renderTemplate({
    templatePath: path.join(api.cwd, 'template.ejs'),
    output: api.output,
    data: {
      ...data,
      dataFromPlugin2: '42!',
    },
  });
};

module.exports = [plugin1, plugin2];
