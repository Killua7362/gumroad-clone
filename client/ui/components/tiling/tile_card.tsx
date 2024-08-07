import { widgetBarItems } from '@/atoms/states';
import { renderNodeContext } from '@/ui/pages/_protected/_layout.home.index.lazy';
import { AnimatePresence, motion } from 'framer-motion';
import { useContext, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import * as portals from 'react-reverse-portal';
import { useRecoilState } from 'recoil';
import DraggingArea from './dragging_area';
import TileBar from './tile_bar';

interface TileCard {
    primaryStyle: React.CSSProperties;
    name: string;
    setDragging: React.Dispatch<React.SetStateAction<boolean>>;
    schemaID: string;
}

const TileCard = ({ primaryStyle, setDragging, name, schemaID }: TileCard) => {
    const renderNode = useContext(renderNodeContext);

    const [widgetItems, setWidgetItems] =
        useRecoilState<string[]>(widgetBarItems);

    const [{ isDragging }, drag, preview] = useDrag({
        type: 'card',
        item: { name, schemaID },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [{ isOver }, drop] = useDrop({
        accept: 'card',
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    useEffect(() => {
        setDragging(isDragging);
    }, [isDragging]);

    return (
        <AnimatePresence>
            {!isDragging && (
                <motion.section
                    layout
                    transition={{ duration: 0.1 }}
                    ref={(newRef) => {
                        preview(newRef);
                        drop(newRef);
                    }}
                    id={name}
                    style={{
                        ...primaryStyle,
                        overflow: 'hidden',
                        position: 'relative',
                    }}
                    className="rounded-md">
                    <TileBar ref={drag} name={name} schemaID={schemaID} />
                    <portals.OutPortal node={renderNode[name].portalNode} />
                    <AnimatePresence>
                        {isOver && (
                            <DraggingArea schemaID={schemaID} name={name} />
                        )}
                    </AnimatePresence>
                </motion.section>
            )}
        </AnimatePresence>
    );
};
export default TileCard;
