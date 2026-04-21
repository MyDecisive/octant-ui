import type { BaseRowDefinition, ColumnType } from "@types";
import classNames from "classnames";
import { baseColumn } from "./constants";

// The argument for this function expects each object to have a `field` and `label` at minimum.
// It may also have a `renderCell` function, if needed.
// See here for more options: https://mui.com/x/api/data-grid/grid-col-def/
export function createColumnDefinitions<T extends BaseRowDefinition>(
  columns: ColumnType<T>[],
) {
  return columns.map((opinionatedColumnDef) => {
    const { cellClassName, headerClassName, ...otherFields } =
      opinionatedColumnDef;
    const combined = { ...baseColumn, ...otherFields };

    if (cellClassName)
      combined.cellClassName = classNames(
        baseColumn.cellClassName,
        cellClassName,
      );
    if (headerClassName)
      combined.headerClassName = classNames(
        baseColumn.headerClassName,
        headerClassName,
      );

    return combined;
  });
}
