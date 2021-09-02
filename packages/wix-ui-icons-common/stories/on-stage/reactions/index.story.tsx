import * as React from "react";
import {
  header,
  tabs,
  tab,
  description,
  importExample,
  title,
  divider,
} from "wix-storybook-utils/Sections";
import IconsExample from "../../components/icons-example";
import GeneralCategoryListBase from "../../components/general-category-list-base/GeneralCategoryListBase";
import reactionsIconsMetadata from "../../../src/on-stage/reactions/metadata";
import * as iconComponents from "../../../src/on-stage/reactions/dist";
import API_Table from "../../APITable";
import { REACTIONS_ICONS, ON_STAGE_CATEGORY } from '../../constants'

export default {
  category: ON_STAGE_CATEGORY,
  storyName: REACTIONS_ICONS,
  component: () => (
    <IconsExample dataHook="icon-list" {...{ iconComponents }} />
  ),

  sections: [
    header({
      sourceUrl:
        "https://github.com/wix/wix-ui/tree/master/packages/wix-ui-icons-common/src/on-stage/reactions",
    }),

    tabs([
      tab({
        title: "Icon List",
        sections: [
          importExample(
            "import HeartMedium from 'wix-ui-icons-common/on-stage/reactions/HeartMedium';"
          ),
          divider(),
          title("Reactions"),
          description({
            text:
              "The usage of each icon type is determined by intention and size. Icons should be used strictly according to the description.",
          }),
          <GeneralCategoryListBase
            iconsMetadata={reactionsIconsMetadata}
            iconComponents={iconComponents}
            iconSizes={[16, 20, 24]}
          />,
        ],
      }),
      tab({
        title: "API",
        sections: [description({ title: "Props", text: API_Table })],
      }),
    ]),
  ],
};

