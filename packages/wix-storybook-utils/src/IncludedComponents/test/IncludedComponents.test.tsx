import * as React from 'react';
import { render } from '@testing-library/react';
import IncludedComponents from '../IncludedComponents';

describe('IncludedComponents', () => {
  it('should render', () => {
    const props = {
      componentsList: [
        { category: 'Category', title: 'FirstComponent', optional: true },
        { category: 'Category', title: 'SecondComponent' },
      ],
    };
    const { container } = render(<IncludedComponents {...props} />);
    //
    // expect(container.querySelector('[data-hook="dodont-do"]')).toBeTruthy();
    // expect(container.querySelector('[data-hook="dodont-dont"]')).toBe(null);
  });
});
