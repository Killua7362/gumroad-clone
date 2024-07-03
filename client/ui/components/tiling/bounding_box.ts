import { v4 as uuid } from 'uuid';

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
            schema: { ...schema.primary },
            id,
            newValue,
            key,
        });
    }

    if (schema.secondary && typeof schema.secondary === 'object') {
        schema.secondary = changeSchemaValue({
            schema: { ...schema.secondary },
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
    replace?: boolean;
}

export const deleteSchema = ({
    schema,
    schemaID,
    name,
    replace = false,
}: deleteSchema): TileSchema => {
    if (
        typeof schema.primary === 'object' &&
        schema.primary.id === schemaID &&
        !replace
    ) {
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
        schema.secondary.id === schemaID &&
        !replace
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
            if (
                schema.secondary &&
                typeof schema.secondary === 'object' &&
                !replace
            ) {
                return schema['secondary'];
            }
        } else if (schema.secondary && schema.secondary === name) {
            delete schema['secondary'];
            if (
                schema.primary &&
                typeof schema.primary === 'object' &&
                !replace
            ) {
                return schema['primary'];
            }
        }

        return schema;
    }

    if (typeof schema.primary === 'object') {
        schema.primary = deleteSchema({
            schema: { ...schema.primary },
            schemaID,
            name,
            replace,
        });
    }
    if (typeof schema.secondary === 'object') {
        schema.secondary = deleteSchema({
            schema: { ...schema.secondary },
            schemaID,
            name,
            replace,
        });
    }
    return schema;
};

export const getSplit = ({
    splitID,
    draggedName,
    droppedName,
}: {
    splitID: string;
    draggedName: string;
    droppedName: string;
}): TileSchema => {
    switch (splitID) {
        case 'left':
            return {
                primary: draggedName,
                secondary: droppedName,
                tile: 'col',
                split: 50,
                id: uuid(),
            };
            break;
        case 'right':
            return {
                primary: droppedName,
                secondary: draggedName,
                tile: 'col',
                split: 50,
                id: uuid(),
            };
            break;
        case 'top':
            return {
                primary: draggedName,
                secondary: droppedName,
                tile: 'row',
                split: 50,
                id: uuid(),
            };
            break;
        default:
            return {
                primary: droppedName,
                secondary: draggedName,
                tile: 'row',
                split: 50,
                id: uuid(),
            };
    }
};

interface createNewSplit {
    schema: TileSchema;
    splitID: string;
    draggedName: string;
    droppedName: string;
    schemaID: string;
    replace?: boolean;
}

export const createNewSplit = ({
    schema,
    splitID,
    draggedName,
    droppedName,
    schemaID,
    replace = false,
}: createNewSplit): TileSchema => {
    if (schema.id === schemaID) {
        if (schema?.primary && schema?.primary === droppedName) {
            schema.primary = getSplit({ splitID, draggedName, droppedName });
        } else if (schema?.secondary && schema?.secondary === droppedName) {
            schema.secondary = getSplit({ splitID, draggedName, droppedName });
        }
    }

    if (typeof schema.primary === 'object') {
        if (schema.primary.id === schemaID && replace) {
            schema.primary = getSplit({ splitID, draggedName, droppedName });
        } else {
            schema.primary = createNewSplit({
                schema: { ...schema.primary },
                splitID,
                draggedName,
                droppedName,
                schemaID,
                replace,
            });
        }
    }
    if (typeof schema.secondary === 'object') {
        if (schema.secondary.id === schemaID && replace) {
            schema.secondary = getSplit({ splitID, draggedName, droppedName });
        } else {
            schema.secondary = createNewSplit({
                schema: { ...schema.secondary },
                splitID,
                draggedName,
                droppedName,
                schemaID,
                replace,
            });
        }
    }
    return schema;
};

interface getAllRenderID {
    schema: TileSchema;
    res?: Set<string>;
}

export const getAllRenderID = ({
    schema,
    res = new Set<string>(),
}: getAllRenderID): Set<string> => {
    if (typeof schema.primary === 'string') {
        res.add(schema.primary);
    } else if (!!schema.primary && typeof schema.primary === 'object') {
        getAllRenderID({ schema: schema.primary, res });
    }

    if (typeof schema.secondary === 'string') {
        res.add(schema.secondary);
    } else if (!!schema.secondary && typeof schema.secondary === 'object') {
        getAllRenderID({ schema: schema.secondary, res });
    }
    return res;
};
