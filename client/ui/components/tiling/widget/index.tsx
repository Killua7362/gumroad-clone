import { tileRootSchema, widgetBarItems } from '@/atoms/states';
import { renderNodeContext } from '@/ui/pages/_protected/_layout.home.index.lazy';
import { motion } from 'framer-motion';
import { useContext } from 'react';
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
          setWidgetItems((prev) => {
            return [...prev, item.name];
          });
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <motion.div
      layout
      ref={drop}
      className="absolute h-full z-50 w-[4.5rem] border-white/30 border-[0.1px] p-2 flex flex-col gap-y-3"
      style={{
        right: '0',
      }}>
      {widgetItems.map((key: string, idx) => {
        return (
          <WidgetTile
            name={renderNode[key].name}
            id={key}
            icon={renderNode[key].icon}
            idx={idx}
          />
        );
      })}
      {isOver && <div className="py-6 border-sky-400 border-2" />}
    </motion.div>
  );
};

export default WidgetBar;
