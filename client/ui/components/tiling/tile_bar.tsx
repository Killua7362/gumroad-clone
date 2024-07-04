import { tileRootSchema, widgetBarItems } from '@/atoms/states';
import { renderNodeContext } from '@/ui/pages/_protected/_layout.home.index.lazy';
import React, { useContext } from 'react';
import { useRecoilState } from 'recoil';
import { deleteSchema } from './bounding_box';

interface TileBar {
    name: string;
    schemaID: string;
}

const TileBar = React.forwardRef<HTMLElement, TileBar>((props, ref) => {
    const { name, schemaID } = props;

    const renderNode = useContext(renderNodeContext);
    const [tileSchema, setTileSchema] = useRecoilState(tileRootSchema);

    const [widgetItems, setWidgetItems] =
        useRecoilState<string[]>(widgetBarItems);

    return (
        <section
            className="w-full h-[2.5rem] cursor-move flex items-center p-4 justify-between text-white border-b-[0.1px] border-white/20 bg-[#1a1c1c]"
            ref={ref}>
            {renderNode[name].name}
            <span
                className="rounded-full bg-red-400 h-4 w-4 text-white p-1 text-sm cursor-pointer"
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
                    setWidgetItems((prev) => {
                        return [...prev, name];
                    });
                }}
            />
        </section>
    );
});

export default TileBar;
