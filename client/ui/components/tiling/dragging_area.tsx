import { tileRootSchema, tileRootSchemaPopulator } from '@/atoms/states';
import { useDrop } from 'react-dnd';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { createNewSplit, deleteSchema, getSplit } from './bounding_box';

const DraggingTile = ({
  style,
  id,
  droppedID,
  droppedName,
}: {
  style: React.CSSProperties;
  id: string;
  droppedID: string;
  droppedName: string;
}) => {
  const tileSchema = useRecoilValue(tileRootSchema);
  const setTileSchema = useSetRecoilState(tileRootSchemaPopulator);

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
            tempSchema = getSplit({ splitID: id, draggedName, droppedName });
          }
        }

        setTileSchema(tempSchema);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div className={`absolute z-50 flex`} ref={drop} style={style}>
      <div
        className="absolute bg-sky-400/30 border-2 border-sky-400"
        style={{
          width: '200%',
          height: '200%',
          display: isOver ? 'block' : 'none',
        }}
      />
    </div>
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
        style={{
          height: '100%',
          width: '25%',
          right: 0,
          bottom: 0,
          justifyContent: 'end',
        }}
        droppedID={schemaID}
        droppedName={name}
      />
      <DraggingTile
        id="left"
        style={{ height: '100%', width: '25%', bottom: 0 }}
        droppedID={schemaID}
        droppedName={name}
      />
      <DraggingTile
        id="bottom"
        style={{ height: '25%', width: '100%', bottom: 0, alignItems: 'end' }}
        droppedID={schemaID}
        droppedName={name}
      />
      <DraggingTile
        id="top"
        style={{ height: '25%', width: '100%', top: 0 }}
        droppedID={schemaID}
        droppedName={name}
      />
    </>
  );
};
export default DraggingArea;
