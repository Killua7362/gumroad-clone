import { tileRootSchema, widgetBarItems } from '@/atoms/states';
import { motion } from 'framer-motion';
import { useDrop } from 'react-dnd';
import { useRecoilState } from 'recoil';
import { createNewSplit, deleteSchema, getSplit } from './bounding_box';

interface DraggingTile {
    style: any;
    initial: any;
    id: string;
    droppedID: string;
    droppedName: string;
}

const DraggingTile = ({
    style,
    initial,
    id,
    droppedID,
    droppedName,
}: DraggingTile) => {
    const [tileSchema, setTileSchema] = useRecoilState(tileRootSchema);
    const [widgetItems, setWidgetItems] =
        useRecoilState<string[]>(widgetBarItems);

    const [{ isOver }, drop] = useDrop({
        accept: 'card',
        drop(item: { name: string; schemaID?: string }, monitor) {
            const didDrop = monitor.didDrop();
            const draggedName = item.name;
            if (monitor.isOver()) {
                let tempSchema: TileSchema = { ...tileSchema };
                if (!!item?.schemaID) {
                    tempSchema = deleteSchema({
                        schema: { ...tempSchema },
                        schemaID: item.schemaID,
                        name: draggedName,
                        replace: droppedID === item.schemaID,
                    });
                } else {
                    setWidgetItems(() => {
                        return widgetItems.filter(
                            (e) => e !== draggedName && e !== ''
                        );
                    });
                }

                tempSchema = createNewSplit({
                    schema: { ...tempSchema },
                    splitID: id,
                    draggedName,
                    droppedName,
                    schemaID: droppedID,
                    replace: droppedID === item.schemaID,
                });

                if (!(!!tempSchema?.primary && !!tempSchema?.secondary)) {
                    if (typeof tempSchema?.primary === 'object') {
                        tempSchema = tempSchema.primary;
                    } else if (typeof tempSchema?.secondary === 'object') {
                        tempSchema = tempSchema.secondary;
                    } else {
                        tempSchema = getSplit({
                            splitID: id,
                            draggedName,
                            droppedName,
                        });
                    }
                }

                setTileSchema(() => {
                    return tempSchema;
                });
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    return (
        <motion.section
            initial={{ opacity: 0, ...initial }}
            exit={{ opacity: 0, ...initial }}
            animate={{ opacity: 1, transition: { duration: 0.3 }, ...style }}
            className={`absolute z-50 flex`}
            ref={drop}>
            <div
                className="absolute bg-sky-400/30 border-2 border-sky-400"
                style={{
                    width: '200%',
                    height: '200%',
                    display: isOver ? 'block' : 'none',
                }}
            />
        </motion.section>
    );
};

const DraggingArea = ({
    schemaID,
    name,
}: {
    schemaID: string;
    name: string;
}) => {
    return (
        <>
            <DraggingTile
                id="right"
                initial={{
                    width: '0%',
                    right: 0,
                    top: 0,
                }}
                style={{
                    height: '50%',
                    width: '25%',
                    right: 0,
                    top: 0,
                    justifyContent: 'end',
                }}
                droppedID={schemaID}
                droppedName={name}
            />
            <DraggingTile
                id="left"
                initial={{
                    width: '0%',
                    top: 0,
                }}
                style={{ height: '50%', width: '25%', top: 0 }}
                droppedID={schemaID}
                droppedName={name}
            />
            <DraggingTile
                id="bottom"
                initial={{
                    height: '0%',
                    bottom: 0,
                }}
                style={{
                    height: '25%',
                    width: '50%',
                    bottom: 0,
                    alignItems: 'end',
                }}
                droppedID={schemaID}
                droppedName={name}
            />
            <DraggingTile
                id="top"
                initial={{
                    height: '0%',
                    top: 0,
                }}
                style={{ height: '25%', width: '50%', top: 0 }}
                droppedID={schemaID}
                droppedName={name}
            />
        </>
    );
};
export default DraggingArea;
