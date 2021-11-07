import React from 'react';
import { LinkTo } from '@storybook/addon-links';
import Text from '../Text';
import { classes } from './IncludedComponents.st.css';
import AnchoredTitle from '../AnchoredTitle';

export type IncludedComponentsProps = { list: IncludedComponent[] };

export type IncludedComponent = {
  category: String;
  title: String;
  optional?: boolean;
};

const List: React.FC<IncludedComponentsProps> = ({ list }) => (
  <div className={classes.list}>
    {list.map((item, id) => {
      const { category, title, optional } = item;

      return (
        <div key={id} className={classes.listItem}>
          <LinkTo kind={category} story={`${category}/${title}`} />
          <Text weight="normal" className={classes.listItem}>
            {optional}
          </Text>
        </div>
      );
    })}
  </div>
);

const IncludedComponents: React.FC<IncludedComponentsProps> = ({ list }) =>
  list && (
    <div className={classes.root}>
      <AnchoredTitle title="Included Components">
        <Text weight="bold">Included Components</Text>
        <List list={list} />
      </AnchoredTitle>
    </div>
  );

export default IncludedComponents;
