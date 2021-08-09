module.exports = ({ components }) => ({
  components: components.map((component) => ({
    ...component,
    path: component.path.toUpperCase(),
  })),
});
