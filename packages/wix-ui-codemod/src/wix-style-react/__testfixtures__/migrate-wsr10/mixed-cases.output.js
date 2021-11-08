/* eslint-disable */
import React from 'react';
import {
  Input,
  Dropdown as WSRDropdown,
  MultiSelectCheckbox,
  Search as WSRSearch,
  MarketingLayout,
  TimeInput as WSRTimeInputNext,
  NestableList,
} from 'wix-style-react';

import {
  AutoComplete as AutoCompleteFromOtherLibrary,
  MultiSelect,
  NumberInput,
  InputArea,
  RadioGroup,
  SortableList,
} from 'some-other-library';

export default class extends React.Component {
  render() {
    return (
      <div>
        <>
          <Input size="medium" />
        </>
        <Input size="medium" />
        <Input size="not_remove" />
        <Input size={'not_remove'} />
        <Input border="round" />
        <AutoCompleteFromOtherLibrary roundInput />
        <WSRDropdown border="round" />
        <MultiSelect roundInput />
        <MultiSelectCheckbox border="round" />
        <NumberInput roundInput />
        <WSRSearch border="round" />
        <InputArea size="normal" />
        <MarketingLayout />
        <MarketingLayout size="not_remove" />
        <RadioGroup lineHeight="24px" />
        <WSRTimeInputNext width="auto" placeholder="Auto" />
        <SortableList
          containerId="single-area-2"
          items={this.state.items}
          renderItem={this._renderItem}
          onDrop={this._handleDrop}
        />
        <NestableList
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
