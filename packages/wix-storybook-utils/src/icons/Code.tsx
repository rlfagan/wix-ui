/* eslint-disable */
/* tslint:disable */
import * as React from 'react';
export interface CodeProps extends React.SVGAttributes<SVGElement> {
size?: string;
}
const Code: React.SFC<CodeProps> = ({size, ...props}) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={ size || "24" } height={ size || "24" } {...props}>
    <path d="M10.9743282,17.1581541 C10.8869821,17.4201184 10.6038101,17.5616743 10.3418459,17.4743282 C10.0798816,17.3869821 9.93832565,17.1038101 10.0256718,16.8418459 L12.9296415,8.13239986 C13.0169876,7.87043562 13.3001596,7.72887965 13.5621239,7.81622576 C13.8240881,7.90357187 13.9656441,8.18674387 13.878298,8.44870812 L10.9743282,17.1581541 Z M4.47182532,12.5 L8.27591774,14.7824555 C8.51270787,14.9245295 8.5894904,15.2316597 8.44741632,15.4684498 C8.30534224,15.7052399 7.99821212,15.7820225 7.76142198,15.6399484 L3.24275212,12.9287465 C2.91908263,12.7345448 2.91908263,12.2654552 3.24275212,12.0712535 L7.77718725,9.35059246 C8.01397739,9.20851838 8.32110752,9.28530091 8.4631816,9.52209104 C8.60525568,9.75888118 8.52847314,10.0660113 8.29168301,10.2080854 L4.47182532,12.5 Z M15.7241578,14.7777259 L19.5282502,12.4952704 L15.7083926,10.2033558 C15.4716024,10.0612817 15.3948199,9.75415159 15.536894,9.51736146 C15.678968,9.28057133 15.9860982,9.2037888 16.2228883,9.34586288 L20.7573234,12.066524 C21.0809929,12.2607257 21.0809929,12.7298152 20.7573234,12.9240169 L16.2386536,15.6352188 C16.0018634,15.7772929 15.6947333,15.7005103 15.5526592,15.4637202 C15.4105852,15.2269301 15.4873677,14.9198 15.7241578,14.7777259 Z"
    />
  </svg>
);
Code.displayName = 'Code';
export default Code;
/* tslint:enable */
/* eslint-enable */
