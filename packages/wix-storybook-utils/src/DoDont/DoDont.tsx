import React from 'react';

import Text from '../Text';
import { st, classes } from './DoDont.st.css';

import { StatusCompleteFilledSmall, DismissSmall } from 'wix-ui-icons-common';

export type DoDontProps = {
  do?: { title?: string; list: String[] };
  dont?: { title?: string; list: String[] };
};

const DismisIcon = () => (
  <div className={classes.dismissContainer}>
    <DismissSmall className={classes.dismissIcon} />
  </div>
);

const CompleteIcon = () => (
  <div className={classes.completeIcon}>
    <StatusCompleteFilledSmall />
  </div>
);

const List: React.FC<{
  list: DoDontProps['do']['list'];
  skin: 'red' | 'green';
}> = ({ skin, list }) => (
  <div className={classes.list}>
    {list.map((item, id) => (
      <Text as="span" key={id} weight="normal" className={classes.listItem}>
        {skin === 'red' ? <DismisIcon /> : <CompleteIcon />}
        {item}
      </Text>
    ))}
  </div>
);

const Block: React.FC<{
  full: boolean;
  skin: 'red' | 'green';
  dataHook: string;
}> = ({ skin, full, children, dataHook }) => (
  <div data-hook={dataHook} className={st(classes.block, { skin, full })}>
    {children}
  </div>
);

const DoDont: React.FC<DoDontProps> = props => (
  <div className={classes.root}>
    {props.do && (
      <Block dataHook="dodont-do" skin="green" full={!props.do || !props.dont}>
        <Text weight="bold" className={st(classes.title, { skin: 'green' })}>
          {props.do.title ? props.do.title : 'Do'}
        </Text>
        <List list={props.do.list} skin="green" />
      </Block>
    )}
    {props.dont && (
      <Block dataHook="dodont-dont" skin="red" full={!props.do || !props.dont}>
        <Text weight="bold" className={st(classes.title, { skin: 'red' })}>
          {props.dont.title ? props.dont.title : `Don't`}
        </Text>
        <List list={props.dont.list} skin="red" />
      </Block>
    )}
  </div>
);

export default DoDont;
