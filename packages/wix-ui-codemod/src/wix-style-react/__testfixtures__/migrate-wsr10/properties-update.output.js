/* eslint-disable */
import React from 'react';
import {
  Input,
  AutoComplete,
  Dropdown,
  MultiSelect,
  MultiSelectCheckbox,
  NumberInput,
  Search,
  InputArea,
  MarketingLayout,
  RadioGroup,
} from 'wix-style-react';

export default class extends React.Component {
  render() {
    return (
      <div>
        <Input size="medium" />
        <Input size="medium" />
        <Input size="not_remove" />
        <Input size={'not_remove'} />
        <Input border="round" />
        <AutoComplete border="round" />
        <Dropdown border="round" />
        <MultiSelect border="round" />
        <MultiSelectCheckbox border="round" />
        <NumberInput border="round" />
        <Search border="round" />
        <InputArea size="medium" />
        <MarketingLayout />
        <MarketingLayout size="not_remove" />
        <RadioGroup />
      </div>
    );
  }
}
