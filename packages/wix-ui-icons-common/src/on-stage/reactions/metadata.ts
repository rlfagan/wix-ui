import { IconMetadata } from "../../types";

const reactions = [
  {
    title: "Angry",
    sizes: { "16": "AngryXSmall", "20": "AngrySmall", "24": "Angry" },
  },
  {
    title: "Clapping",
    sizes: { "16": "ClappingXSmall", "20": "ClappingSmall", "24": "Clapping" },
  },
  {
    title: "Heart",
    sizes: { "16": "HeartXSmall", "20": "HeartSmall", "24": "Heart" },
  },
  {
    title: "Sad",
    sizes: { "16": "SadXSmall", "20": "SadSmall", "24": "Sad" },
  },
  {
    title: "Smiley",
    sizes: { "16": "SmileyXSmall", "20": "SmileySmall", "24": "Smiley" },
  },
  {
    title: "SmileyTears",
    sizes: { "16": "SmileyTearsXSmall", "20": "SmileyTearsSmall", "24": "SmileyTears" },
  },
  {
    title: "Surprised",
    sizes: { "16": "SurprisedXSmall", "20": "SurprisedSmall", "24": "Surprised" },
  },
  {
    title: "Suspicious",
    sizes: { "16": "SuspiciousXSmall", "20": "SuspiciousSmall", "24": "Suspicious" },
  },
  {
    title: "ThumbUp",
    sizes: { "16": "ThumbUpXSmall", "20": "ThumbUpSmall", "24": "ThumbUp" },
  },
]

const tpaIconsMetadata: Array<IconMetadata> = reactions.map(item => ({
    description: "",
    tags: [],
    category: "Reactions",
    hasColors: true,
    ...item,
  }));

export default tpaIconsMetadata;
