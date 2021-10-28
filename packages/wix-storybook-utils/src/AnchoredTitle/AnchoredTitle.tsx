import React, { useState, useRef } from 'react';
import { LinkSmall, ConfirmSmall } from 'wix-ui-icons-common';
import copy from 'copy-to-clipboard';
import ReactTooltip from 'react-tooltip';
import addons from '@storybook/addons';

import Heading from '../Heading';
import { classes } from './AnchoredTitle.st.css';

export const AnchoredTitle = ({ title, children = null }) => {
  const [copied, setCopied] = useState(false);
  const id = title.replace(/\s+/g, '_');
  const copyLinkRef = useRef(null);

  const onCopy = (event: React.MouseEvent) => {
    event.preventDefault();

    setCopied(true);
    addons.getChannel().emit('navigateUrl', `#${id}`);
    setTimeout(() => {
      copy(new URL(window.parent.location as any).href);
    });
  };

  const onMouseEnter = () => ReactTooltip.show(copyLinkRef.current);

  const onMouseLeave = () =>
    ReactTooltip.hide(copyLinkRef.current) && setCopied(false);

  const onAnchorClicked = event =>
    children ? onCopy(event) : event.preventDefault();

  return (
    <div
      className={classes.root}
      onClick={!children && onCopy}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <a
        ref={copyLinkRef}
        data-for={id}
        data-tip
        className={classes.link}
        id={id}
        href={`#${id}`}
        target="_self"
        onClick={onAnchorClicked}
      >
        <LinkSmall />
      </a>
      {!children ? <Heading as="h3">{title}</Heading> : children}
      <ReactTooltip
        id={id}
        effect="solid"
        arrowColor="transparent"
        offset={{ top: -5 }}
        className={classes.tooltip}
      >
        <div className={classes.tooltipContent}>
          {copied && <ConfirmSmall />}
          {copied ? 'Copied' : 'Copy Link'}
        </div>
      </ReactTooltip>
    </div>
  );
};
