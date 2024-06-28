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

  if (newSchema.primary && typeof newSchema.primary === 'object') {
    newSchema.primary = addID({ schema: newSchema.primary });
  }

  if (newSchema.secondary && typeof newSchema.secondary === 'object') {
    newSchema.secondary = addID({ schema: newSchema.secondary });
  }

  return newSchema;
};

interface changeSchemaValue {
  schema: TileSchema;
  id: string;
  newValue: any;
  key: string;
}

export const changeSchemaValue = ({
  schema,
  id,
  newValue,
  key,
}: changeSchemaValue): TileSchema => {
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

interface deleteSchema {
  schema: TileSchema;
  schemaID: string;
  name: string;
}

export const deleteSchema = ({
  schema,
  schemaID,
  name,
}: deleteSchema): TileSchema => {
  if (typeof schema.primary === 'object' && schema.primary.id === schemaID) {
    if (!(!!schema.primary.primary && !!schema.primary.secondary)) {
      delete schema['primary'];
    } else {
      if (
        typeof schema.primary.primary === 'string' &&
        schema.primary.primary !== name
      ) {
        schema['primary'] = schema.primary.primary;
      } else if (
        typeof schema.primary.secondary === 'string' &&
        schema.primary.secondary !== name
      ) {
        schema['primary'] = schema.primary.secondary;
      }
    }
  }

  if (
    typeof schema.secondary === 'object' &&
    schema.secondary.id === schemaID
  ) {
    if (!(!!schema.secondary.primary && !!schema.secondary.secondary)) {
      delete schema['secondary'];
    } else {
      if (
        typeof schema.secondary.primary === 'string' &&
        schema.secondary.primary !== name
      ) {
        schema['secondary'] = schema.secondary.primary;
      } else if (
        typeof schema.secondary.secondary === 'string' &&
        schema.secondary.secondary !== name
      ) {
        schema['secondary'] = schema.secondary.secondary;
      }
    }
  }

  //if there is only primary and secondary strings
  if (schema.id === schemaID) {
    if (schema.primary && schema.primary === name) {
      delete schema['primary'];
    } else if (schema.secondary && schema.secondary === name) {
      delete schema['secondary'];
    }

    return schema;
  }

  if (typeof schema.primary === 'object') {
    schema.primary = deleteSchema({ schema: schema.primary, schemaID, name });
  }
  if (typeof schema.secondary === 'object') {
    schema.secondary = deleteSchema({
      schema: schema.secondary,
      schemaID,
      name,
    });
  }
  return schema;
};

interface createNewSplit {
  schema: TileSchema;
  splitID: string;
  draggedName: string;
  droppedName: string;
  schemaID: string;
}
export const createNewSplit = ({
  schema,
  splitID,
  draggedName,
  droppedName,
  schemaID,
}: createNewSplit): TileSchema => {
  if (schema.id === schemaID) {
    let tempSchema: TileSchema;
    switch (splitID) {
      case 'left':
        tempSchema = {
          primary: draggedName,
          secondary: droppedName,
          tile: 'col',
          split: 50,
          id: uuid(),
        };
        break;
      case 'right':
        tempSchema = {
          primary: droppedName,
          secondary: draggedName,
          tile: 'col',
          split: 50,
          id: uuid(),
        };
        break;
      case 'top':
        tempSchema = {
          primary: draggedName,
          secondary: droppedName,
          tile: 'row',
          split: 50,
          id: uuid(),
        };
        break;
      default:
        tempSchema = {
          primary: droppedName,
          secondary: draggedName,
          tile: 'row',
          split: 50,
          id: uuid(),
        };
    }
    if (schema?.primary && schema?.primary === droppedName) {
      schema.primary = tempSchema;
    } else if (schema?.secondary && schema?.secondary === droppedName) {
      schema.secondary = tempSchema;
    }
    return schema;
  }

  if (typeof schema.primary === 'object') {
    schema.primary = createNewSplit({
      schema: schema.primary,
      splitID,
      draggedName,
      droppedName,
      schemaID,
    });
  }
  if (typeof schema.secondary === 'object') {
    schema.secondary = createNewSplit({
      schema: schema.secondary,
      splitID,
      draggedName,
      droppedName,
      schemaID,
    });
  }
  return schema;
};
