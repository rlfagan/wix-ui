export const _size = `
<StorybookComponents.Stack flexDirection="column">
  <Text size="medium">
    Size medium is a default size that's used most of the time.
  </Text>
  <Text size="small">
    Small size is used where medium doesn't fit or content is less important.
  </Text>
  <Text size="tiny">
    Tiny size is used when there's no space or it's the last thing users need to
    see.
  </Text>
</StorybookComponents.Stack>;
`;

export const _weight = `
<StorybookComponents.Stack flexDirection="column">
  <Text weight="bold">
    Bold weight is meant to emphasize running text.
  </Text>
  <Text weight="normal">
    Normal weight is for form field values and buttons.
  </Text>
  <Text weight="thin">
    Thin weight is for a running text. All major paragraphs use it.
  </Text> 
</StorybookComponents.Stack>;
`;

export const _light = `
<StorybookComponents.Stack flexDirection="column">
  <Text>Dark text is used on light backgrounds.</Text>
  <StorybookComponents.Background skin="dark">
    <Text light>Light text is used on dark backgrounds.</Text>
  </StorybookComponents.Background>
</StorybookComponents.Stack>;
`;

export const _secondary = `
<StorybookComponents.Stack flexDirection="column">
  <Text skin="standard" secondary>
    Dark secondary text is used where it's less important than standard text.
  </Text>
  <StorybookComponents.Background skin="dark">
    <Text light secondary>
      Light secondary text also serves as neutral content just on a dark
      background.
    </Text>
  </StorybookComponents.Background>
</StorybookComponents.Stack>;
`;
