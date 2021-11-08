/* eslint-disable */
import React from 'react';
import {
  Input,
  Dropdown as WSRDropdown,
  MultiSelectCheckbox,
  Search as WSRSearch,
  MarketingLayout,
  TimeInputNext as WSRTimeInputNext,
  StyledNestableList,
  FontUpgrade as WSRFontUpgrade
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
        <WSRFontUpgrade>
          <Input size="normal" />
        </WSRFontUpgrade>
        <Input size={'normal'} />
        <Input size="not_remove" />
        <Input size={'not_remove'} />
        <Input roundInput={true} />
        <AutoCompleteFromOtherLibrary roundInput />
        <WSRDropdown roundInput />
        <MultiSelect roundInput />
        <MultiSelectCheckbox roundInput />
        <NumberInput roundInput />
        <WSRSearch roundInput />
        <InputArea size="normal" />
        <MarketingLayout size="large" />
        <MarketingLayout size="not_remove" />
        <RadioGroup lineHeight="24px" />
        <WSRTimeInputNext width="auto" placeholder="Auto" />
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
