import { useEffect, useState } from 'react';
import { changeSchemaValue } from './bounding_box';

interface isHolding {
  holding: boolean;
  originX: number;
  originY: number;
}

const TileDragging = ({
  schema,
  parentBoundingBox,
  setTileRootProps,
}: {
  schema: TileSchema;
  parentBoundingBox: DOMRect;
  setTileRootProps: React.Dispatch<React.SetStateAction<TileRootProps>>;
}) => {
  const [isHolding, setIsHolding] = useState<isHolding>({
    holding: false,
    originX: 0,
    originY: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event: any) => {
      if (isHolding.holding) {
        if (schema.tile === 'row') {
          //change in y and height
          const topHeightSplit =
            parentBoundingBox.height * (schema.split! / 100);
          const cursorY = isHolding.originY - event.clientY;
          const changeInYSplit =
            (100 * (topHeightSplit - cursorY)) / parentBoundingBox.height;
          setTileRootProps((prev: TileRootProps) => {
            return {
              ...prev,
              schema: changeSchemaValue({
                schema: { ...prev.schema },
                id: schema.id!,
                key: 'split',
                newValue: changeInYSplit,
              }),
            };
          });
        } else {
          //change in x and width
          const leftWidthSplit =
            parentBoundingBox.width * (schema.split! / 100);
          const cursorX = isHolding.originX - event.clientX;
          const changeInXSplit =
            (100 * (leftWidthSplit - cursorX)) / parentBoundingBox.width;
          setTileRootProps((prev: TileRootProps) => {
            return {
              ...prev,
              schema: changeSchemaValue({
                schema: { ...prev.schema },
                id: schema.id!,
                key: 'split',
                newValue: changeInXSplit,
              }),
            };
          });
        }
      }
    };

    const handleMouseUp = (event: any) => {
      setIsHolding({
        holding: false,
        originX: 0,
        originY: 0,
      });
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isHolding]);

  return (
    <div
      className={`${schema?.tile === 'row' ? 'h-[0.3rem] w-full cursor-row-resize' : 'h-full w-[0.3rem] cursor-col-resize'} hover:bg-blue-400`}
      onMouseDown={(event) => {
        setIsHolding({
          holding: true,
          originX: event.pageX,
          originY: event.pageY,
        });
      }}
    />
  );
};

export default TileDragging;
