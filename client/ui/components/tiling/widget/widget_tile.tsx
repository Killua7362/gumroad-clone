import { tileRootSchema, widgetBarItems } from '@/atoms/states';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useRecoilState } from 'recoil';
import { deleteSchema } from '../bounding_box';

interface WidgetTile {
    name: string;
    id: string;
    icon: React.ReactNode | undefined;
    idx: number;
    activeName: string;
    setActiveName: React.Dispatch<React.SetStateAction<string>>;
    setChildOver: React.Dispatch<React.SetStateAction<boolean>>;
}

const WidgetTile = ({
    name,
    id,
    icon,
    idx,
    activeName,
    setActiveName,
    setChildOver,
}: WidgetTile) => {
    const [widgetItems, setWidgetItems] =
        useRecoilState<string[]>(widgetBarItems);
    const [tileSchema, setTileSchema] = useRecoilState(tileRootSchema);
    const [{ isDragging }, drag] = useDrag({
        type: 'card',
        item: { name: id },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        end: (item: { name: string }, monitor) => {
            let tempWidgetItems: string[] = [...widgetItems];
            if (!monitor.didDrop()) {
                const index = tempWidgetItems.indexOf('');
                if (index !== -1) {
                    tempWidgetItems[index] = item.name;
                    setWidgetItems(tempWidgetItems);
                }
            }
        },
    });

    const [{ isOver }, drop] = useDrop({
        accept: 'card',
        drop: (item: { name: string; schemaID?: string }, monitor) => {
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
        },
        hover: (item: { name: string; schemaID?: string }, monitor) => {
            let tempWidgetItems: string[];
            tempWidgetItems = widgetItems.filter(
                (e) => e !== item.name && e !== ''
            );
            setWidgetItems(() =>
                Array.prototype.toSpliced.call(tempWidgetItems, idx, 0, '')
            );
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    const [isHover, setIsOver] = useState(false);
    useEffect(() => {
        const setActiveNameToNull = () => {
            setActiveName('');
        };
        document.addEventListener('mousedown', setActiveNameToNull);
        return () =>
            document.addEventListener('mousedown', setActiveNameToNull);
    }, []);

    useEffect(() => {
        setChildOver(isOver);
    }, [isOver]);

    return (
        <motion.li
            className={`h-[3rem] ${name === '' ? 'border-blue-400' : 'border-white/30'} hover:border-white border-[0.1px] bg-background flex items-center justify-center cursor-pointer rounded-md overflow-none relative`}
            onMouseEnter={() => {
                setIsOver(true);
            }}
            onMouseLeave={() => {
                setIsOver(false);
            }}
            onClick={() => {
                setActiveName(activeName === name ? '' : name);
            }}
            ref={(newRef) => {
                drag(drop(newRef));
            }}>
            {
                // <FcAlarmClock className="text-3xl"/>
            }
            {id}
            <AnimatePresence>
                {isHover && !isDragging && activeName !== name && (
                    <motion.article
                        initial={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        animate={{
                            opacity: 1,
                            transition: { duration: 0.3 },
                        }}
                        className={`absolute left-[-8rem] bg-white text-black w-[8rem] text-center py-[0.4rem]`}>
                        {name}
                    </motion.article>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {
                    // !isDragging && activeName === name &&
                    // <motion.div
                    // 				initial={{opacity:0}}
                    // 				exit={{opacity:0}}
                    // 				animate={{opacity:1,transition:{duration:0.3}}}
                    // 				className='absolute left-[-8rem] bg-white text-black w-[8rem] text-center py-[0.4rem]'>
                    // 		testing
                    // </motion.div>
                }
            </AnimatePresence>
        </motion.li>
    );
};
export default WidgetTile;
