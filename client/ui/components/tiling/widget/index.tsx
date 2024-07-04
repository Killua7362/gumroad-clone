import { tileRootSchema, widgetBarItems } from '@/atoms/states';
import { renderNodeContext } from '@/ui/pages/_protected/_layout.home.index.lazy';
import { motion } from 'framer-motion';
import { useContext, useState } from 'react';
import { useDrop } from 'react-dnd';
import { useRecoilState } from 'recoil';
import { deleteSchema } from '../bounding_box';
import WidgetTile from './widget_tile';

const WidgetBar = () => {
    const renderNode = useContext(renderNodeContext);
    const [tileSchema, setTileSchema] = useRecoilState(tileRootSchema);
    const [widgetItems, setWidgetItems] =
        useRecoilState<string[]>(widgetBarItems);

    const [{ isOver }, drop] = useDrop({
        accept: 'card',
        drop: (item: { name: string; schemaID?: string }, monitor) => {
            if (monitor.isOver()) {
                let tempSchema: TileSchema = { ...tileSchema };
                if (!!item?.schemaID) {
                    tempSchema = deleteSchema({
                        schema: { ...tempSchema },
                        schemaID: item.schemaID,
                        name: item.name,
                        replace: false,
                    });
                    setTileSchema(() => {
                        return tempSchema;
                    });
                }
                let tempWidgetItems: string[] = [...widgetItems];
                const index = tempWidgetItems.indexOf('');
                if (index !== -1) {
                    tempWidgetItems[index] = item.name;
                    setWidgetItems(tempWidgetItems);
                }
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
        hover: (item: { name: string; schemaID?: string }, monitor) => {
            let tempWidgetItems: string[] = [...widgetItems];
            const index = tempWidgetItems.indexOf('');
            if (index === -1) {
                tempWidgetItems.push('');
                setWidgetItems(tempWidgetItems);
            }
        },
    });

    const [activeName, setActiveName] = useState<string>('');
    const [childOver, setChildOver] = useState(false);

    return (
        <motion.nav
            layout
            ref={drop}
            className="absolute h-full z-50 w-[4.5rem] border-white/30 border-[0.1px] p-2 flex flex-col gap-y-3"
            onMouseDown={(e) => {
                e.stopPropagation();
            }}
            style={{
                right: '0',
            }}>
            {widgetItems.map((key: string, idx) => {
                return (
                    <WidgetTile
                        name={renderNode[key]?.name ?? ''}
                        id={key}
                        icon={renderNode[key]?.icon ?? ''}
                        idx={idx}
                        activeName={activeName}
                        setActiveName={setActiveName}
                        setChildOver={setChildOver}
                    />
                );
            })}
        </motion.nav>
    );
};

export default WidgetBar;
