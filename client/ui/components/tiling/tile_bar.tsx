import { tileRootSchema } from '@/atoms/states';
import { renderNodeContext } from '@/ui/pages/_protected/_layout.home.index.lazy';
import React, { useContext } from 'react';
import { useRecoilState } from 'recoil';
import { deleteSchema } from './bounding_box';

interface TileBar {
  name: string;
  schemaID: string;
}
const TileBar = React.forwardRef<HTMLDivElement, TileBar>((props, ref) => {
  const { name, schemaID } = props;

  const renderNode = useContext(renderNodeContext);
  const [tileSchema, setTileSchema] = useRecoilState(tileRootSchema);

  return (
    <div
      className="w-full h-[2.5rem] bg-white cursor-move flex items-center p-4 justify-between"
      ref={ref}>
      <span>{renderNode[name].name}</span>
      <div
        className="rounded-full bg-black h-4 w-4 text-white p-1 text-sm cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setTileSchema(() => {
            return deleteSchema({
              schema: { ...tileSchema },
              schemaID,
              name,
              replace: false,
            });
          });
        }}></div>
    </div>
  );
});

export default TileBar;
