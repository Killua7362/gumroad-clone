import { tileRootSchema, tileRootSchemaPopulator } from '@/atoms/states';
import { renderNodeContext } from '@/ui/pages/_protected/_layout.home.index.lazy';
import { useContext, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import * as portals from 'react-reverse-portal';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import DraggingArea from './dragging_area';
import TileBar from './tile_bar';

const TileCard = ({
  primaryStyle,
  setDragging,
  name,
  schemaID,
}: {
  primaryStyle: React.CSSProperties;
  name: string;
  setDragging: React.Dispatch<React.SetStateAction<boolean>>;
  schemaID: string;
}) => {
  const renderNode = useContext(renderNodeContext);
  const tileSchema = useRecoilValue(tileRootSchema);
  const setTileSchema = useSetRecoilState(tileRootSchemaPopulator);

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
    !isDragging && (
      <div
        ref={(newRef) => {
          preview(newRef);
          drop(newRef);
        }}
        id={name}
        style={{ ...primaryStyle, overflow: 'hidden', position: 'relative' }}>
        <TileBar ref={drag} name={name} schemaID={schemaID} />
        <portals.OutPortal node={renderNode[name].portalNode} />
        {isOver && <DraggingArea schemaID={schemaID} name={name} />}
      </div>
    )
  );
};
export default TileCard;
