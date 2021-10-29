export default {
  description:
    'Text is a general typography component used to construct any text content.',
  do: [
    'Use it to display text paragraphs formed from a single or multiple sentences.',
    'Use it to display form element values and labels.',
  ],
  dont: ['Don’t use it to highlight status, use <Badge/> instead.'],
  featureExamples: [
    {
      title: 'Size',
      description: `Control the size of the text with \`size\` prop. It supports 3 sizes:<br/>
        &emsp;- \`medium\` (default) - use it in all common cases of running text.<br/>
        &emsp;- \`small\` - use it for field labels and secondary content.<br/>
        &emsp;- \`tiny\` - use it for short messages of minor importance.`,
      example: '_size',
    },
    {
      title: 'Weight',
      description: `Control the weight of the text with \`weight\` prop. It supports 3 weights:<br/>
        &emsp;- \`bold\` - use it to emphasise running text.<br/>
        &emsp;- \`normal\` - use it for form field values and button labels.<br/>
        &emsp;- \`thin\` (default) - use it for all major paragraphs.`,
      example: '_weight',
    },
    {
      title: 'Light',
      description: `Invert text color so it can be used on a dark background with \`light\` prop. It affects standard and disabled skins only.`,
      example: '_light',
    },
    {
      title: 'Secondary',
      description: `Emphasise content hierarchy by setting running text priority to \`secondary\`. 
        It applies lower contrast font color for standard skin text only.`,
      example: '_secondary',
    },
  ],
};
