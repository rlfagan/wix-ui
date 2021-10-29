export default {
  description:
    'This section should provide enough information for a user to make a decision if it’s a right component for a case or an alternative solution should be selected instead.',
  do: [
    'Use it to explain primary purpose of the component',
    'Use it to explain if its a building part of larger component',
  ],
  featureExamples: [
    {
      title: 'Do List',
      description: `Provide a list for recommending componet use case using \`do\` property.
      <br/>
      <br/> 
      Additionally \`title\` prop can be added to override the original one.`,
      example: '_do',
    },
    {
      title: 'Dont List',
      description: `Provide a list for giving alternative component use case using \`dont\` property.
      <br/> 
      <br/>
      Additionally \`title\` prop can be added to override the original one.`,
      example: '_dont',
    },
  ],
};
