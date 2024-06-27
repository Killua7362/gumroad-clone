import { useEffect } from 'react';
import { useDrag } from 'react-dnd';

const TileCard = ({
  primaryStyle,
  renderChild,
  name,
  setDragging,
}: {
  primaryStyle: React.CSSProperties;
  renderChild: React.ReactNode;
  name: string;
  setDragging: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'card',
    item: { name },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    setDragging(isDragging);
  }, [isDragging]);

  return (
    !isDragging && (
      <div style={{ ...primaryStyle, overflow: 'hidden' }} ref={drag}>
        <div className="w-full h-[2.5rem] bg-white cursor-move" />
        {renderChild}
      </div>
    )
  );
};
export default TileCard;
