import { tileRootSchema } from '@/atoms/states';
import { renderNodeContext } from '@/ui/pages/_protected/_layout.home.index.lazy';
import { motion } from 'framer-motion';
import { useContext } from 'react';
import { useRecoilValue } from 'recoil';
import { getAllRenderID } from '../bounding_box';
import WidgetTile from './widget_tile';

const WidgetBar = () => {
  const renderNode = useContext(renderNodeContext);
  const tileSchema = useRecoilValue(tileRootSchema);
  const schemaIDs = getAllRenderID({ schema: tileSchema });
  return (
    <motion.div
      layout
      className="absolute h-full z-50 w-[4.5rem] border-white/30 border-[0.1px] p-2 flex flex-col gap-y-3"
      style={{
        right: '0',
      }}>
      {Object.entries(renderNode).map(([key, val]) => {
        return (
          !schemaIDs.has(key) && (
            <WidgetTile name={val.name} id={key} icon={val?.icon} />
          )
        );
      })}
    </motion.div>
  );
};

export default WidgetBar;
