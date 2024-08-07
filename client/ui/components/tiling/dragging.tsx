import { tileRootSchema } from '@/atoms/states';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { changeSchemaValue } from './bounding_box';

interface isHolding {
    holding: boolean;
    originX: number;
    originY: number;
}

interface TileDragging {
    schema: TileSchema;
    parentBoundingBox: DOMRect;
}

const TileDragging = ({ schema, parentBoundingBox }: TileDragging) => {
    const [isHolding, setIsHolding] = useState<isHolding>({
        holding: false,
        originX: 0,
        originY: 0,
    });

    const [tileSchema, setTileSchema] = useRecoilState(tileRootSchema);

    useEffect(() => {
        const handleMouseMove = (event: any) => {
            if (isHolding.holding) {
                if (schema.tile === 'row') {
                    //change in y and height
                    const topHeightSplit =
                        parentBoundingBox.height * (schema.split! / 100);
                    const cursorY = isHolding.originY - event.clientY;
                    const changeInYSplit =
                        (100 * (topHeightSplit - cursorY)) /
                        parentBoundingBox.height;
                    setTileSchema(() => {
                        return changeSchemaValue({
                            schema: { ...tileSchema },
                            id: schema.id!,
                            key: 'split',
                            newValue: changeInYSplit,
                        });
                    });
                } else {
                    //change in x and width
                    const leftWidthSplit =
                        parentBoundingBox.width * (schema.split! / 100);
                    const cursorX = isHolding.originX - event.clientX;
                    const changeInXSplit =
                        (100 * (leftWidthSplit - cursorX)) /
                        parentBoundingBox.width;
                    setTileSchema(() => {
                        return changeSchemaValue({
                            schema: { ...tileSchema },
                            id: schema.id!,
                            key: 'split',
                            newValue: changeInXSplit,
                        });
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
            className={`${schema?.tile === 'row' ? 'h-[0.2rem] my-[0.3rem] w-full cursor-row-resize' : 'h-full mx-[0.3rem] w-[0.2rem] cursor-col-resize'} hover:bg-blue-400`}
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
