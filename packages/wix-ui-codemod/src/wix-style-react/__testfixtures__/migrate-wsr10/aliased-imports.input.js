/* eslint-disable */
import React from 'react';
import {
  Input as AliasedInput,
  Dropdown as AliasedDropdown,
  MultiSelectCheckbox as AliasedMultiSelectCheckbox,
  Search as AliasedSearch,
  MarketingLayout as AliasedMarketingLayout,
  TimeInputNext as AliasedTimeInputNext,
  StyledNestableList as AliasedStyledNestableList,
  FontUpgrade as AliasedFontUpgrade,
  AutoComplete as AliasedAutoComplete,
  MultiSelect as AliasedMultiSelect,
  NumberInput as AliasedNumberInput,
  InputArea as AliasedInputArea,
  RadioGroup as AliasedRadioGroup,
  SortableList as AliasedSortableList,
} from 'wix-style-react';

export default class extends React.Component {
  render() {
    return (
      <div>
        <AliasedFontUpgrade>
          <AliasedInput size="normal" />
        </AliasedFontUpgrade>
        <AliasedFontUpgrade active={true}>
          <AliasedInput size="normal" />
        </AliasedFontUpgrade>
        <AliasedFontUpgrade as="div">
          <AliasedInput size="normal" />
        </AliasedFontUpgrade>
        <AliasedInput size={'normal'} />
        <AliasedInput size="not_remove" />
        <AliasedInput size={'not_remove'} />
        <AliasedInput roundInput={true} />
        <AliasedAutoComplete roundInput />
        <AliasedDropdown roundInput />
        <AliasedMultiSelect roundInput />
        <AliasedMultiSelectCheckbox roundInput />
        <AliasedNumberInput roundInput />
        <AliasedSearch roundInput />
        <AliasedInputArea size="normal" />
        <AliasedMarketingLayout size="large" />
        <AliasedMarketingLayout size="not_remove" />
        <AliasedRadioGroup lineHeight="24px" />
        <AliasedTimeInputNext width="auto" placeholder="Auto" />
        <AliasedSortableList
          containerId="single-area-2"
          items={this.state.items}
          renderItem={this._renderItem}
          onDrop={this._handleDrop}
        />
        <AliasedStyledNestableList
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
