const plugin1 = () => {
  // plugin1 is valid
  return {};
};

const plugin2 = async () => {
  const later = (fn) =>
    new Promise((resolve, reject) =>
      setImmediate(() => {
        try {
          resolve(fn());
        } catch (e) {
          reject(e);
        }
      }),
    );

  const promises = ['a', 'b', null].map(async (n) => {
    return later(() => {
      n.toUpperCase();
    });
  });

  return Promise.all(promises);
};

module.exports = [plugin1, plugin2];
