/* eslint-disable */
/* tslint:disable */
import * as React from 'react';
export interface SearchProps extends React.SVGAttributes<SVGElement> {
size?: string;
}
const Search: React.SFC<SearchProps> = ({size, ...props}) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={ size || "24" } height={ size || "24" } {...props}>
    <path d="M19.8535534,19.1464466 C20.0488155,19.3417088 20.0488155,19.6582912 19.8535534,19.8535534 C19.6582912,20.0488155 19.3417088,20.0488155 19.1464466,19.8535534 L15.4380219,16.1451287 C14.1187738,17.3000688 12.3911257,18 10.5,18 C6.35786438,18 3,14.6421356 3,10.5 C3,6.35786438 6.35786438,3 10.5,3 C14.6421356,3 18,6.35786438 18,10.5 C18,12.3911257 17.3000688,14.1187738 16.1451287,15.4380219 L19.8535534,19.1464466 Z M17,10.5 C17,6.91014913 14.0898509,4 10.5,4 C6.91014913,4 4,6.91014913 4,10.5 C4,14.0898509 6.91014913,17 10.5,17 C14.0898509,17 17,14.0898509 17,10.5 Z"
    />
  </svg>
);
Search.displayName = 'Search';
export default Search;
/* tslint:enable */
/* eslint-enable */
