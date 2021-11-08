/* eslint-disable */
import React from 'react';
import {
  Input as AliasedInput,
  Dropdown as AliasedDropdown,
  MultiSelectCheckbox as AliasedMultiSelectCheckbox,
  Search as AliasedSearch,
  MarketingLayout as AliasedMarketingLayout,
  TimeInput as AliasedTimeInputNext,
  NestableList as AliasedStyledNestableList,
  AutoComplete as AliasedAutoComplete,
  MultiSelect as AliasedMultiSelect,
  NumberInput as AliasedNumberInput,
  InputArea as AliasedInputArea,
  RadioGroup as AliasedRadioGroup,
  SortableListBase as AliasedSortableList,
} from 'wix-style-react';

export default class extends React.Component {
  render() {
    return (
      <div>
        <>
          <AliasedInput size="medium" />
        </>
        <>
          <AliasedInput size="medium" />
        </>
        <div>
          <AliasedInput size="medium" />
        </div>
        <AliasedInput size="medium" />
        <AliasedInput size="not_remove" />
        <AliasedInput size={'not_remove'} />
        <AliasedInput border="round" />
        <AliasedAutoComplete border="round" />
        <AliasedDropdown border="round" />
        <AliasedMultiSelect border="round" />
        <AliasedMultiSelectCheckbox border="round" />
        <AliasedNumberInput border="round" />
        <AliasedSearch border="round" />
        <AliasedInputArea size="medium" />
        <AliasedMarketingLayout />
        <AliasedMarketingLayout size="not_remove" />
        <AliasedRadioGroup />
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
