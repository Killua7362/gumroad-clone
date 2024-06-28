import { useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { deleteSchema } from './bounding_box';
import DraggingArea from './dragging_area';

const TileCard = ({
  primaryStyle,
  renderChild,
  setDragging,
  name,
  schemaID,
  setTileRootProps,
}: {
  primaryStyle: React.CSSProperties;
  renderChild: React.ReactNode;
  name: string;
  setDragging: React.Dispatch<React.SetStateAction<boolean>>;
  schemaID: string;
  setTileRootProps: React.Dispatch<React.SetStateAction<TileRootProps>>;
}) => {
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: 'card',
      item: { name },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const didDrop = monitor.didDrop();
        if (didDrop) {
          setTileRootProps((prev: TileRootProps) => {
            return {
              ...prev,
              schema: deleteSchema({
                schema: { ...prev.schema },
                schemaID,
                name,
              }),
            };
          });
        }
      },
    }),
    [name]
  );

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: 'card',
      drop(item: unknown, monitor) {
        const didDrop = monitor.didDrop();
        if (didDrop) {
          return;
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    []
  );

  useEffect(() => {
    setDragging(isDragging);
  }, [isDragging]);

  return (
    !isDragging && (
      <div
        ref={(newRef) => {
          preview(newRef);
          drop(newRef);
        }}
        id={name}
        style={{ ...primaryStyle, overflow: 'hidden', position: 'relative' }}>
        <div className="w-full h-[2.5rem] bg-white cursor-move" ref={drag} />
        {renderChild}
        {isOver && (
          <DraggingArea
            schemaID={schemaID}
            name={name}
            setTileRootProps={setTileRootProps}
          />
        )}
      </div>
    )
  );
};
export default TileCard;
