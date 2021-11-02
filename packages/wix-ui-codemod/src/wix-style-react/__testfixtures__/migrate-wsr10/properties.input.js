import React from 'react';
import { Checkbox } from 'wix-style-react';

export default class extends React.Component {
  render() {
    return (
      <div>
        <Input size="normal" />
        <Input size={'normal'} />
        <Input size="not_remove" />
        <Input size={'not_remove'} />
        <Input roundInput={true} />
        <AutoComplete roundInput />
        <Dropdown roundInput />
        <MultiSelect roundInput />
        <MultiSelectCheckbox roundInput />
        <NumberInput roundInput />
        <Search roundInput />
        <InputArea size="normal" />
        <MarketingLayout size="large" />
        <MarketingLayout size="not_remove" />
        <RadioGroup lineHeigh="24px" />
      </div>
    );
  }
}
