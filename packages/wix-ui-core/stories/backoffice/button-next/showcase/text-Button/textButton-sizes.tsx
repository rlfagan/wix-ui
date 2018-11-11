import * as React from 'react';

import CodeShowcase from 'wix-storybook-utils/CodeShowcase';
import ChevronDown from 'wix-ui-icons-common/ChevronDown';
import { ButtonNext } from '../../../../../src/components/button-next';
import { backofficeTheme } from '../../../../../src/themes/backoffice';
import { textButton } from '../../../../../src/themes/backoffice';

const example = `import * as React from "react";
import { ButtonNext } from "wix-ui-core/button-next";
import { textButton } from "wix-ui-core/themes/backoffice";
import ChevronDown from 'wix-ui-icons-common/ChevronDown';

export default () => (
  <React.Fragment>
    <ButtonNext className={textButton('small')} prefixIcon={<ChevronDown />}>
      small
    </ButtonNext>
    <ButtonNext className={textButton()} prefixIcon={<ChevronDown />}>
      medium
    </ButtonNext>
  </React.Fragment>
);`;

const description = (
  <div>
    Text Button supports only <code>small</code> and <code>medium</code> sizes.
    The default value is <code>medium</code>
  </div>
);

interface TextButtonSizesProps {
  style?: object;
}

export const TextButtonSizes = ({ style }: TextButtonSizesProps) => (
  <CodeShowcase
    title="Text Buttons (sizes)"
    style={style}
    code={example}
    theme={backofficeTheme}
    description={description}
  >
    <ButtonNext className={textButton('small')} prefixIcon={<ChevronDown />}>
      small
    </ButtonNext>
    <ButtonNext className={textButton()} prefixIcon={<ChevronDown />}>
      medium
    </ButtonNext>
  </CodeShowcase>
);
