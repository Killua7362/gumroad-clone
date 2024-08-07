import { tileRootSchema, widgetBarItems } from '@/atoms/states';
import TilingRoot from '@/ui/components/tiling';
import { getAllRenderID } from '@/ui/components/tiling/bounding_box';
import { createLazyFileRoute } from '@tanstack/react-router';
import { Component, createContext, useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import * as portals from 'react-reverse-portal';
import { useRecoilState, useRecoilValue } from 'recoil';

export const Route = createLazyFileRoute('/_protected/_layout/home/')({
    component: () => {
        return <Home />;
    },
});

export interface TileRender {
    [id: string]: {
        name: string;
        portalNode: portals.HtmlPortalNode<Component<any>>;
        icon?: React.ReactNode;
    };
}

export const renderNodeContext = createContext<TileRender>({});

const Home = () => {
    const tileSchema: TileSchema = useRecoilValue(tileRootSchema);
    const [rendered, setRendered] = useState(false);
    const [widgetItems, setWidgetItems] =
        useRecoilState<string[]>(widgetBarItems);

    const renderDivs = {
        A: [<div className="h-full w-full"></div>, 'First'],
        B: [<div className="h-full w-full"></div>, 'Second'],
        C: [<div className="h-full w-full"></div>, 'Third'],
        D: [<div className="h-full w-full"></div>, 'Fourth'],
    };

    const renderNode: TileRender = Object.fromEntries(
        Object.entries(renderDivs).map(([key, val]) => {
            return [
                key,
                {
                    name: val[1] as string,
                    portalNode: portals.createHtmlPortalNode({
                        attributes: {
                            style: 'width:100%; height:calc(100% - 2.5rem);background-color:#141716',
                        },
                    }),
                },
            ];
        })
    );
    useEffect(() => {
        const allSchemaIds: Set<string> = getAllRenderID({
            schema: tileSchema as TileSchema,
        });
        let tempWidgetItems: string[] = [...widgetItems];
        if (
            Object.keys(renderDivs).length !==
            allSchemaIds.size + widgetItems.length
        ) {
            tempWidgetItems = Object.keys(renderDivs).filter(
                (e) => !allSchemaIds.has(e)
            );
        }
        let idx = tempWidgetItems.indexOf('');
        if (idx !== -1) {
            tempWidgetItems[idx] = Object.keys(renderDivs).filter(
                (e) => !allSchemaIds.has(e) && tempWidgetItems.indexOf(e) !== -1
            )[0];
        }
        setWidgetItems(() => {
            return tempWidgetItems;
        });
        setRendered(true);
    }, []);

    return (
        rendered && (
            <renderNodeContext.Provider value={renderNode}>
                <article className="h-[calc(86vh-2.25rem)] w-full relative flex items-center overflow-hidden mt-9">
                    <DndProvider backend={HTML5Backend}>
                        <TilingRoot />
                    </DndProvider>
                </article>

                {Object.entries(renderDivs).map(([key, val]) => {
                    return (
                        <portals.InPortal node={renderNode[key].portalNode}>
                            {val[0]}
                        </portals.InPortal>
                    );
                })}
            </renderNodeContext.Provider>
        )
    );
};
