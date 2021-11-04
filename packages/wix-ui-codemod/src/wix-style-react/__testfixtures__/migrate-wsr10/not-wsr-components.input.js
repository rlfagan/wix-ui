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
  TimeInputNext,
  SortableList,
  StyledNestableList
} from 'some-other-library';

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
        <RadioGroup lineHeight="24px" />
        <TimeInputNext width="auto" placeholder="Auto" />
        <SortableList
          containerId="single-area-2"
          items={this.state.items}
          renderItem={this._renderItem}
          onDrop={this._handleDrop}
        />
        <StyledNestableList
          withBottomBorder
          items={[
            {
              id: 1,
              options: [{ value: 'Home' }],
            },
            {
              id: 2,
              options: [{ value: 'Salons' }],
            },
            {
              id: 3,
              options: [{ value: 'Shop' }],
            },
            {
              id: 4,
              options: [{ value: 'Support' }],
            },
          ]}
          onChange={() => {}}
        />
      </div>
    );
  }
}
