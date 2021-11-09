import * as React from 'react';
import { IncludedComponentsSection } from '../../typings/story-section';
import IncludedComponents from '../../IncludedComponents';

export const includedComponents = (props: IncludedComponentsSection) => (
  <IncludedComponents includedComponents={props.includedComponents} />
);
