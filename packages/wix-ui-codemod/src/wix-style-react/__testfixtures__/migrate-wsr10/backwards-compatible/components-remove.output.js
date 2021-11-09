/* eslint-disable */
import React from 'react';
import { FontUpgrade } from 'wix-style-react';

export default class extends React.Component {
  render() {
    return (
      <div>
        <FontUpgrade active={true}>
            <Input size="normal" />
        </FontUpgrade>
        <FontUpgrade as="div">
            <Input size="normal" />
        </FontUpgrade>
        <FontUpgrade>
            <Input size={'normal'} />
            <Input size="not_remove" />
            <Input size={'not_remove'} />
        </FontUpgrade>
      </div>
    );
  }
}
