import React from 'react';
import { linkTo } from '@storybook/addon-links';
import Text from '../Text';
import TextButton from '../TextButton';
import { classes } from './IncludedComponents.st.css';
import { IncludedComponent } from '../typings/story';

export type IncludedComponentsProps = {
  includedComponents: IncludedComponent[];
};

const IncludedComponents: React.FC<IncludedComponentsProps> = ({
  includedComponents,
}) =>
  includedComponents && (
    <div className={classes.list}>
      {includedComponents.map((componentItem, id) => {
        const { category, title, optional } = componentItem;

        return (
          <div key={`item-${id}`} className={classes.listItem}>
            <TextButton onClick={linkTo(category as string, title as string)}>{`<${title}/>`}</TextButton>
            {optional && (
              <Text
                className={classes.optionalText}
                size="small"
                weight="thin"
                light
                secondary
              >
                Optional
              </Text>
            )}
          </div>
        );
      })}
    </div>
  );

export default IncludedComponents;
