const importsObject = {
  'wix-ui-tpa/dist/src/assets/icons/Anonymous.svg':
    /* move to system folder*/ 'TODO',
  'wix-ui-tpa/dist/src/assets/icons/Arrow': /* icons for tooltip*/ 'TODO',
  'wix-ui-tpa/dist/src/assets/icons/Calendar.svg':
    'wix-ui-icons-common/on-stage/Calendar',
  'wix-ui-tpa/dist/src/assets/icons/Camera.svg':
    'wix-ui-icons-common/on-stage/system/VideoFillXSmall',
  'wix-ui-tpa/dist/src/assets/icons/CaretDown.svg':
    'wix-ui-icons-common/on-stage/ArrowDown',
  'wix-ui-tpa/dist/src/assets/icons/CaretUp.svg':
    'wix-ui-icons-common/on-stage/ArrowUp',
  'wix-ui-tpa/dist/src/assets/icons/Check.svg':
    'wix-ui-icons-common/on-stage/Check',
  'wix-ui-tpa/dist/src/assets/icons/CheckSuccess.svg':
    'wix-ui-icons-common/on-stage/Check',
  'wix-ui-tpa/dist/src/assets/icons/ChevronLeft.svg':
    'wix-ui-icons-common/on-stage/ArrowRight',
  'wix-ui-tpa/dist/src/assets/icons/ChevronLeft.tsx':
    'wix-ui-icons-common/on-stage/ArrowRight',
  'wix-ui-tpa/dist/src/assets/icons/ChevronRight.svg':
    'wix-ui-icons-common/on-stage/ArrowLeft',
  'wix-ui-tpa/dist/src/assets/icons/ChevronRight.tsx':
    'wix-ui-icons-common/on-stage/ArrowLeft',
  'wix-ui-tpa/dist/src/assets/icons/Close.svg':
    'wix-ui-icons-common/on-stage/CloseSmall',
  'wix-ui-tpa/dist/src/assets/icons/DoubleChevronLeft.tsx':
    'wix-ui-icons-common/on-stage/DoubleArrowLeft',
  'wix-ui-tpa/dist/src/assets/icons/DoubleChevronRight.tsx':
    'wix-ui-icons-common/on-stage/DoubleArrowRight',
  'wix-ui-tpa/dist/src/assets/icons/Error.svg':
    'wix-ui-icons-common/on-stage/Error',
  'wix-ui-tpa/dist/src/assets/icons/Heart.svg':
    'wix-ui-icons-common/on-stage/LikeHeart',
  'wix-ui-tpa/dist/src/assets/icons/PlusL.svg':
    'wix-ui-icons-common/on-stage/Plus',
  'wix-ui-tpa/dist/src/assets/icons/PlusS.svg':
    'wix-ui-icons-common/on-stage/system/PlusXSmall',
  'wix-ui-tpa/dist/src/assets/icons/PlusXL.svg':
    'wix-ui-icons-common/on-stage/system/PlusLarge',
  'wix-ui-tpa/dist/src/assets/icons/Share.svg':
    'wix-ui-icons-common/on-stage/Share',
  'wix-ui-tpa/dist/src/assets/icons/Star.svg':
    'wix-ui-icons-common/on-stage/Favorite',
  'wix-ui-tpa/dist/src/assets/icons/XSmall.svg':
    'wix-ui-icons-common/on-stage/system/CloseXSmall',
  'wix-ui-tpa/dist/src/assets/icons/minus.svg':
    'wix-ui-icons-common/on-stage/MinusSmall',
  'wix-ui-tpa/dist/src/assets/icons/plus.svg':
    'wix-ui-icons-common/on-stage/PlusSmall',
  'wix-ui-tpa/dist/src/assets/icons/Social/CopyLink.svg':
    'wix-ui-icons-common/on-stage/Link',
  'wix-ui-tpa/dist/src/assets/icons/Social/Facebook.svg':
    'wix-ui-icons-common/on-stage/Facebook',
  'wix-ui-tpa/dist/src/assets/icons/Social/GooglePodcast.svg':
    'wix-ui-icons-common/on-stage/GooglePodcast',
  'wix-ui-tpa/dist/src/assets/icons/Social/Instagram.svg':
    'wix-ui-icons-common/on-stage/Instagram',
  'wix-ui-tpa/dist/src/assets/icons/Social/Linkedin.svg':
    'wix-ui-icons-common/on-stage/LinkedIn',
  'wix-ui-tpa/dist/src/assets/icons/Social/Pinterest.svg':
    'wix-ui-icons-common/on-stage/Pinterest',
  'wix-ui-tpa/dist/src/assets/icons/Social/Podcast.svg':
    'wix-ui-icons-common/on-stage/Podcast',
  'wix-ui-tpa/dist/src/assets/icons/Social/Rss.svg':
    'wix-ui-icons-common/on-stage/RSS',
  'wix-ui-tpa/dist/src/assets/icons/Social/Soundcloud.svg':
    'wix-ui-icons-common/on-stage/SoundCloud',
  'wix-ui-tpa/dist/src/assets/icons/Social/Spotify.svg':
    'wix-ui-icons-common/on-stage/Spotify',
  'wix-ui-tpa/dist/src/assets/icons/Social/Stitcher.svg':
    'wix-ui-icons-common/on-stage/Stitcher',
  'wix-ui-tpa/dist/src/assets/icons/Social/Tumblr.svg':
    'wix-ui-icons-common/on-stage/Tumblr',
  'wix-ui-tpa/dist/src/assets/icons/Social/Twitter.svg':
    'wix-ui-icons-common/on-stage/Twitter',
  'wix-ui-tpa/dist/src/assets/icons/Social/Vimeo.svg':
    'wix-ui-icons-common/on-stage/Vimeo',
  'wix-ui-tpa/dist/src/assets/icons/Social/Youtube.svg':
    'wix-ui-icons-common/on-stage/Youtube',
};

const importsMap = new Map();

Object.entries(importsObject).forEach((entry) => {
  importsMap.set(entry[0], entry[1]);
});

module.exports = importsMap;
