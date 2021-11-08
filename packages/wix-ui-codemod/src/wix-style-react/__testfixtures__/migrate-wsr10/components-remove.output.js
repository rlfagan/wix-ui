/* eslint-disable */
import React from 'react';

export default class extends React.Component {
  render() {
    return (
      <div>
        <>
            <Input size="normal" />
        </>
        <div>
            <Input size="normal" />
        </div>
        <>
            <Input size={'normal'} />
            <Input size="not_remove" />
            <Input size={'not_remove'} />
        </>
      </div>
    );
  }
}
