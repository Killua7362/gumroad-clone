import { useDrop } from 'react-dnd';
import { createNewSplit } from './bounding_box';

const DraggingTile = ({
  style,
  id,
  droppedID,
  droppedName,
  setTileRootProps,
}: {
  style: React.CSSProperties;
  id: string;
  droppedID: string;
  droppedName: string;
  setTileRootProps: React.Dispatch<React.SetStateAction<TileRootProps>>;
}) => {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: 'card',
      drop(item: { name: string }, monitor) {
        const didDrop = monitor.didDrop();
        const draggedName = item.name;
        setTileRootProps((prev: TileRootProps) => {
          return {
            ...prev,
            schema: createNewSplit({
              schema: { ...prev.schema },
              splitID: id,
              draggedName,
              droppedName,
              schemaID: droppedID,
            }),
          };
        });
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    []
  );
  return (
    <div className={`absolute z-50 flex`} ref={drop} style={style}>
      <div
        className="absolute bg-sky-400/30 border-2 border-sky-400"
        style={{
          width: '200%',
          height: '200%',
          display: isOver ? 'block' : 'none',
        }}></div>
    </div>
  );
};

const DraggingArea = ({
  schemaID,
  name,
  setTileRootProps,
}: {
  schemaID: string;
  name: string;
  setTileRootProps: React.Dispatch<React.SetStateAction<TileRootProps>>;
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
        setTileRootProps={setTileRootProps}
      />
      <DraggingTile
        id="left"
        style={{ height: '100%', width: '25%', bottom: 0 }}
        droppedID={schemaID}
        droppedName={name}
        setTileRootProps={setTileRootProps}
      />
      <DraggingTile
        id="bottom"
        style={{ height: '25%', width: '100%', bottom: 0, alignItems: 'end' }}
        droppedID={schemaID}
        droppedName={name}
        setTileRootProps={setTileRootProps}
      />
      <DraggingTile
        id="top"
        style={{ height: '25%', width: '100%', top: 0 }}
        droppedID={schemaID}
        droppedName={name}
        setTileRootProps={setTileRootProps}
      />
    </>
  );
};
export default DraggingArea;
