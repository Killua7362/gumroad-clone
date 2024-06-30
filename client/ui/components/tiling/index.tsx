import { tileRootSchema, tileRootSchemaPopulator } from '@/atoms/states';
import { motion } from 'framer-motion';
import { useDrop } from 'react-dnd';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { v4 as uuid } from 'uuid';
import RecurseTile from './recurse_tile';
import WidgetBar from './widget';

const TilingRoot = () => {
  const tileSchema = useRecoilValue(tileRootSchema);

  const setTileSchema = useSetRecoilState(tileRootSchemaPopulator);

  const [{ isOver }, drop] = useDrop({
    accept: 'card',
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    drop(item: { name: string; schemaID?: string }, monitor) {
      const didDrop = monitor.didDrop();
      const draggedName = item.name;
      if (
        !(
          tileSchema.hasOwnProperty('primary') ||
          tileSchema.hasOwnProperty('secondary')
        )
      ) {
        setTileSchema({
          primary: draggedName,
          tile: 'row',
          split: 100,
          id: uuid(),
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
          height: 'calc(100% - 2rem)',
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
