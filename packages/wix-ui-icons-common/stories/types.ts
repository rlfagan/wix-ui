import { IconMetadata } from "../src/types";

/** [icon component, icon name, small icon component,
 * small icon name, description] */
export type GeneralTableRow = [
  React.ReactNode,
  string | undefined,
  React.ReactNode,
  string | undefined,
  string | undefined
];
/** [icon name, icon sizes, description] */
export type SystemTableRow = [string, React.ReactNode, string | undefined];
export type CategoryTableRow = GeneralTableRow | SystemTableRow;

export type Category = {
  title: string;
  tableHeaderTitles: Array<string>;
  rows: Array<CategoryTableRow>;
};

export type IconProps = React.SVGAttributes<SVGElement> & {
  size?: string;
};

export type IconDescriptor = {
  size: string;
  name: string;
  Icon: React.FC<IconProps>;
};

export type IconsMetadataIndex = Fuse<
  IconMetadata,
  Pick<Fuse.FuseOptions<IconMetadata>, "keys" | "threshold">
>;