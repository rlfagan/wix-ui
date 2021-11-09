/* eslint-disable */
import React from 'react';
import {
  TimeInputNext,
  SortableList,
  StyledNestableList
} from 'wix-style-react';

export default class extends React.Component {
  render() {
    return (
      <div>
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
