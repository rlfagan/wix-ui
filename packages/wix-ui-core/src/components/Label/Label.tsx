import * as React from 'react';
import {string, bool} from 'prop-types';
import style from './Label.st.css';

export interface LabelProps {
  className?: string;
  /** Children */
  children?: string;
  /** For property */
  for?: string;
  /** ID of element */
  id?: string;
  /** should the text be ellipsed or not */
  ellipsis?: boolean;
  /** Is the Label disabled */
  disabled?: boolean;
}

const defaultProps: LabelProps = {
  ellipsis: false
};

/**
 * Label
 */
export const Label: React.SFC<LabelProps> = props => {
  const {id, children, ellipsis, disabled} = props;
  return <label {...style('root', {ellipsis, disabled}, props)} htmlFor={props.for} id={id}>{children}</label>;
};

Label.propTypes = {
  /** class name */
  className: string,
  /** children */
  children: string,
  /** For property */
  for: string,
  /** ID of element */
  id: string,
  /** should the text be ellipsed or not */
  ellipsis: bool,
  /** Is the Label disabled */
  disabled: bool
};

Label.defaultProps = defaultProps;
