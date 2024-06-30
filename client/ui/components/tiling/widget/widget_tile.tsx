import React from 'react';
import { useDrag } from 'react-dnd';

const WidgetTile = ({
  name,
  id,
  icon,
}: {
  name: string;
  id: string;
  icon: React.ReactNode | undefined;
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'card',
    item: { name: id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  return (
    !isDragging && (
      <div
        className="h-[3rem] border-white/30 border-[0.1px] bg-background flex items-center justify-center"
        ref={drag}>
        {
          // <FcAlarmClock className="text-3xl"/>
        }
        {id}
      </div>
    )
  );
};
export default WidgetTile;
