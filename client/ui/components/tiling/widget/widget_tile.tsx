import { widgetBarItems } from '@/atoms/states';
import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useRecoilState } from 'recoil';

const WidgetTile = ({
  name,
  id,
  icon,
  idx,
}: {
  name: string;
  id: string;
  icon: React.ReactNode | undefined;
  idx: number;
}) => {
  const [widgetItems, setWidgetItems] =
    useRecoilState<string[]>(widgetBarItems);
  const [{ isDragging }, drag] = useDrag({
    type: 'card',
    item: { name: id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'card',
    hover: (item: { name: string; schemaID?: string }, monitor) => {
      let tempWidgetItems: string[];
      tempWidgetItems = widgetItems.filter((e) => e !== item.name);
      setWidgetItems(() =>
        Array.prototype.toSpliced.call(tempWidgetItems, idx, 0, item.name)
      );
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      className="h-[3rem] border-white/30 border-[0.1px] bg-background flex items-center justify-center"
      ref={(newRef) => {
        drag(drop(newRef));
      }}>
      {
        // <FcAlarmClock className="text-3xl"/>
      }
      {id}
    </div>
  );
};
export default WidgetTile;
