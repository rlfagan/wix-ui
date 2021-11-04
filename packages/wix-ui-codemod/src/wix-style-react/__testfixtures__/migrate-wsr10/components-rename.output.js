/* eslint-disable */
import React from 'react';
import {
  TimeInput,
  SortableListBase,
  NestableList
} from 'wix-style-react';

export default class extends React.Component {
  render() {
    return (
      <div>
        <TimeInput width="auto" placeholder="Auto" />
        <SortableListBase
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
