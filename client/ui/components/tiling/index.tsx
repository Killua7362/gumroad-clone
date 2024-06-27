import { motion, useAnimationControls } from 'framer-motion';
import { useRef, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { IoArrowBack } from 'react-icons/io5';
import { addID, getActiveBoxId } from './bounding_box';
import RecurseTile from './recurse_tile';

const TilingRoot = ({
  initialRender,
  initialSchema,
}: {
  initialSchema?: TileSchema;
  initialRender?: TileRender;
}) => {
  const [widgetPanelOpen, setWidgetPanelOpen] = useState(false);

  const animateControls = useAnimationControls();

  const widgetRootRef = useRef<HTMLDivElement | null>(null);

  const [tileRootProps, setTileRootProps] = useState<TileRootProps>({
    render: initialRender,
    schema: initialSchema ? addID({ schema: initialSchema }) : initialSchema,
  });

  return (
    <>
      <motion.div
        layout
        ref={widgetRootRef}
        style={{
          height: 'calc(100% - 2rem)',
          width: widgetPanelOpen ? 'calc(100% - 16rem)' : 'calc(100% - 3rem)',
        }}>
        <DndProvider backend={HTML5Backend}>
          <RecurseTile
            tileRootProps={tileRootProps}
            initialStyle={{ width: '100%', height: '100%' }}
            setTileRootProps={setTileRootProps}
          />
        </DndProvider>
      </motion.div>
      <motion.div
        layout
        className="absolute h-full flex z-50"
        style={{
          right: widgetPanelOpen ? '0' : '-15rem',
        }}>
        <div
          className={`border-white/30 border-[0.1px] ${widgetPanelOpen ? 'border-l-0 rotate-180' : 'border-r-0'} h-fit bg-background mt-10 cursor-pointer`}
          onClick={() => {
            setWidgetPanelOpen(!widgetPanelOpen);
          }}>
          <IoArrowBack className="m-3" />
        </div>
        <div className="border-white/30 border-[0.1px] w-[15rem] h-full bg-background p-2">
          <motion.div
            drag
            onPointerUp={() => {
              animateControls.set({
                x: 0,
                y: 0,
              });
            }}
            onDragEnd={(_, info) => {
              //started dropping divs here
            }}
            onDrag={(_, info) => {
              if (widgetRootRef.current) {
                const { top, bottom, left, right } =
                  widgetRootRef.current.getBoundingClientRect();
                if (
                  top <= info.point.y &&
                  info.point.y <= bottom &&
                  left <= info.point.x &&
                  info.point.x <= right
                ) {
                  //in zone
                  console.log(
                    getActiveBoxId({
                      schema: tileRootProps?.schema!,
                      point: info.point,
                      top,
                      left,
                      right,
                      bottom,
                    })
                  );
                }
              }
            }}
            animate={animateControls}
            className="h-[3rem] border-white/30 border-[0.1px] bg-background">
            testing
          </motion.div>
          <div className="h-[3rem] border-white/30 border-[0.1px] bg-background">
            testing
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default TilingRoot;
