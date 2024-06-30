import TilingRoot from '@/ui/components/tiling';
import { createLazyFileRoute } from '@tanstack/react-router';
import { Component, createContext, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import * as portals from 'react-reverse-portal';

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
  const primaryNode: portals.HtmlPortalNode<Component<any>> =
    portals.createHtmlPortalNode();
  const [portalNodes, setPortalNodes] =
    useState<portals.HtmlPortalNode<Component<any>>[]>();

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
        { name: val[1] as string, portalNode: portals.createHtmlPortalNode() },
      ];
    })
  );

  return (
    <renderNodeContext.Provider value={renderNode}>
      <div className="h-[100vh] w-full relative flex items-center overflow-hidden">
        <DndProvider backend={HTML5Backend}>
          <TilingRoot />
        </DndProvider>
      </div>
      {Object.entries(renderDivs).map(([key, val]) => {
        return (
          <portals.InPortal node={renderNode[key].portalNode}>
            {val[0]}
          </portals.InPortal>
        );
      })}
    </renderNodeContext.Provider>
  );
};
