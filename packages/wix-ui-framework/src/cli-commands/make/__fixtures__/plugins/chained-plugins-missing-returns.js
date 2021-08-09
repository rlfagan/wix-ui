const path = require('path');

const plugin1 = (data, api) => {
  return {
    dataFromPlugin1: data.components.length,
    cwd: api.cwd,
  };
};

const plugin2 = () => {
  // intentionally noop
};

const plugin3 = () => {
  // intentionally returning empty object
  // data should be retained even when empty object is returned in one of the plugins
  return {};
}

const plugin4 = async (data, api) => {
  await api.renderTemplate({
    templatePath: path.join(api.cwd, 'template.ejs'),
    output: api.output,
    data: {
      ...data,
      dataFromPlugin4: '42!',
    },
  });
};

module.exports = [plugin1, plugin2, plugin3, plugin4];
