import { tileRootSchema, widgetBarItems } from '@/atoms/states';
import { motion } from 'framer-motion';
import { useDrop } from 'react-dnd';
import { useRecoilState } from 'recoil';
import { v4 as uuid } from 'uuid';
import RecurseTile from './recurse_tile';
import WidgetBar from './widget';

const TilingRoot = () => {
    const [tileSchema, setTileSchema] = useRecoilState(tileRootSchema);
    const [widgetItems, setWidgetItems] =
        useRecoilState<string[]>(widgetBarItems);

    const [{ isOver }, drop] = useDrop({
        accept: 'card',
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
        drop(item: { name: string; schemaID?: string }, monitor) {
            const didDrop = monitor.didDrop();
            const draggedName = item.name;
            setWidgetItems(() => {
                return widgetItems.filter((e) => e !== draggedName && e !== '');
            });
            if (
                !(
                    tileSchema.hasOwnProperty('primary') ||
                    tileSchema.hasOwnProperty('secondary')
                )
            ) {
                setTileSchema(() => {
                    return {
                        primary: draggedName,
                        tile: 'row',
                        split: 100,
                        id: uuid(),
                    };
                });
            }
        },
    });

    return (
        <>
            <motion.div
                layout
                ref={drop}
                className={`${isOver && !(!!tileSchema?.primary || !!tileSchema?.secondary) && 'bg-sky-400/30 border-2 border-sky-400'} `}
                style={{
                    height: 'calc(100% - 3rem)',
                    width: 'calc(100% - 7rem)',
                }}>
                <RecurseTile
                    schema={tileSchema}
                    initialStyle={{ width: '100%', height: '100%' }}
                />
            </motion.div>
            <WidgetBar />
        </>
    );
};

export default TilingRoot;
