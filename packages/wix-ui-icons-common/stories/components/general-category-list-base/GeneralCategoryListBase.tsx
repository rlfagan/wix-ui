import * as React from "react";
import CategoryList from "../category-list";
import { classes } from "./GeneralCategoryListBase.st.css";
import { IconMetadata } from "../../../src/types";
import { GeneralCategoryListProps } from '../../types'

const ICON_NAME_HEADER = 'Icon Name';
const DESCRIPTION_HEADER = 'Use for';
const DEFAULT_SEARCH_KEYS = ['title', 'tags', 'aliases'];
const getHeaderTitle = (size) => `${size}x${size}`;
const getSearchKey = (size) => `sizes.${size}`;

const GeneralCategoryListBase: React.FC<GeneralCategoryListProps> = ({
  iconComponents,
  iconsMetadata,
  iconSizes = [24, 18],
}) => {
  const searchKeys = [ ...DEFAULT_SEARCH_KEYS, ...iconSizes.map(size => getSearchKey(size)) ];
  const tableHeaderTitles = [
    ...iconSizes.reduce<Array<string>>((acc, size) => {
      acc.push(getHeaderTitle(size));
      acc.push(ICON_NAME_HEADER);
      return acc;
    }, []),
    DESCRIPTION_HEADER
  ];

  const mapIconToRow = (
    {
      description,
      sizes,
    }: IconMetadata) => {
    const row = iconSizes.reduce<Array<any>>((acc, size) => {
      const Icon = iconComponents[sizes[size]];
      acc.push(Icon && <Icon />);
      acc.push(sizes[size]);
      return acc;
    }, []);

    return [...row, description];
  }

  return (
    <CategoryList
      className={classes.tableList}
      dataHook="icon-list"
      iconsMetadata={iconsMetadata}
      {...{
        tableHeaderTitles,
        searchKeys,
        mapIconToRow,
      }}
    />
  )
};

export default GeneralCategoryListBase;
