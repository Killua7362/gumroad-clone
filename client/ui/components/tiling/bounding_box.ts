import { Point } from 'framer-motion';

interface activeBoxId {
  schema: TileSchema;
  point: Point;
  left: number;
  right: number;
  bottom: number;
  top: number;
}

export const getActiveBoxId = ({
  schema,
  point,
  left,
  right,
  top,
  bottom,
}: activeBoxId): string => {
  const width = right - left;
  const height = bottom - top;

  const leftContainerWidth = width * (schema.split! / 100);
  const rightContainerWidth = width - leftContainerWidth;
  const leftContainerHeight = height * (schema.split! / 100);
  const rightContainerHeight = height - leftContainerHeight;

  const resolveSubSchema = (subSchema: TileSchema | string): string =>
    typeof subSchema === 'string'
      ? subSchema
      : getActiveBoxId({ schema: subSchema, point, left, right, top, bottom });

  if (
    typeof schema.secondary === 'undefined' ||
    typeof schema.primary === 'undefined'
  ) {
    return typeof schema.secondary === 'undefined'
      ? resolveSubSchema(schema.primary!)
      : resolveSubSchema(schema.secondary);
  } else {
    if (schema.tile === 'row') {
      if (point.y < top + leftContainerHeight) {
        if (typeof schema.primary === 'string') {
          return schema.primary;
        } else {
          return getActiveBoxId({
            schema: schema.primary,
            point,
            left,
            right,
            top,
            bottom: top + leftContainerHeight,
          });
        }
      } else {
        if (typeof schema.secondary === 'string') {
          return schema.secondary;
        } else {
          return getActiveBoxId({
            schema: schema.secondary,
            point,
            left,
            right,
            top: top + leftContainerHeight,
            bottom,
          });
        }
      }
    } else {
      if (point.x < left + leftContainerWidth) {
        if (typeof schema.primary === 'string') {
          return schema.primary;
        } else {
          return getActiveBoxId({
            schema: schema.primary,
            point,
            left,
            right: left + leftContainerWidth,
            top,
            bottom,
          });
        }
      } else {
        if (typeof schema.secondary === 'string') {
          return schema.secondary;
        } else {
          return getActiveBoxId({
            schema: schema.secondary,
            point,
            left: left + leftContainerWidth,
            right,
            top,
            bottom,
          });
        }
      }
    }
  }
};
