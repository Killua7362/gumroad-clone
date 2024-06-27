import { Point } from 'framer-motion';
import { v4 as uuid } from 'uuid';

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

export const addID = ({ schema }: { schema: TileSchema }): TileSchema => {
  let newSchema = { ...schema };

  newSchema.id = uuid();
  newSchema.primaryDragging = false;
  newSchema.secondaryDraggig = false;

  if (newSchema.primary && typeof newSchema.primary === 'object') {
    newSchema.primary = addID({ schema: newSchema.primary });
  }

  if (newSchema.secondary && typeof newSchema.secondary === 'object') {
    newSchema.secondary = addID({ schema: newSchema.secondary });
  }

  return newSchema;
};

export const changeSchemaValue = ({
  schema,
  id,
  newValue,
  key,
}: {
  schema: TileSchema;
  id: string;
  newValue: any;
  key: string;
}): TileSchema => {
  if (schema.id === id) {
    (schema as any)[key] = newValue;
    return schema;
  }

  if (schema.primary && typeof schema.primary === 'object') {
    schema.primary = changeSchemaValue({
      schema: schema.primary,
      id,
      newValue,
      key,
    });
  }

  if (schema.secondary && typeof schema.secondary === 'object') {
    schema.secondary = changeSchemaValue({
      schema: schema.secondary,
      id,
      newValue,
      key,
    });
  }

  return schema;
};
