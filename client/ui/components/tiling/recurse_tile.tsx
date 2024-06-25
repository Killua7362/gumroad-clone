import { useState } from 'react';
import TileDragging from './dragging';

const RecurseTile = ({
  tileRootProps,
  initialStyle,
  setTileRootProps,
}: {
  tileRootProps: TileRootProps;
  initialStyle: TileInitialStyle;
  setTileRootProps: React.Dispatch<React.SetStateAction<TileRootProps>>;
}) => {
  let { render, schema } = { ...tileRootProps };

  const primaryStyle = {
    width:
      schema?.secondary && schema?.tile === 'col'
        ? schema?.split + '%'
        : '100%',
    height:
      schema?.secondary && schema?.tile === 'row'
        ? schema?.split + '%'
        : '100%',
    border: '0.1px solid rgba(255,255,255,0.3)',
  };

  const secondaryStyle = {
    width:
      schema?.secondary && schema?.tile === 'col'
        ? 100 - (schema?.split || 0) + '%'
        : '100%',
    height:
      schema?.secondary && schema?.tile === 'row'
        ? 100 - (schema?.split || 0) + '%'
        : '100%',
    border: '0.1px solid rgba(255,255,255,0.3)',
  };

  const [recurseTileRef, setRecurseTileRef] = useState<HTMLDivElement>();

  return (
    <div
      className={`flex ${schema?.tile === 'row' ? 'flex-col' : 'flex-row'} text-black`}
      style={{
        height: initialStyle.height,
        width: initialStyle.width,
      }}
      ref={(newRef) => {
        newRef && setRecurseTileRef(newRef);
      }}>
      {typeof schema?.primary === 'string' ? (
        <div style={primaryStyle}>{render![schema.primary]}</div>
      ) : (
        <>
          {typeof schema?.primary === 'object' ? (
            <RecurseTile
              tileRootProps={{ render, schema: { ...schema.primary } }}
              initialStyle={primaryStyle}
              setTileRootProps={setTileRootProps}
            />
          ) : null}
        </>
      )}
      {recurseTileRef && (
        <TileDragging
          schema={schema!}
          setTileRootProps={setTileRootProps}
          parentBoundingBox={recurseTileRef.getBoundingClientRect()}
        />
      )}
      {typeof schema?.secondary === 'string' ? (
        <div style={secondaryStyle}>{render![schema.secondary]}</div>
      ) : (
        <>
          {typeof schema?.secondary === 'object' ? (
            <RecurseTile
              tileRootProps={{ render, schema: { ...schema.secondary } }}
              initialStyle={secondaryStyle}
              setTileRootProps={setTileRootProps}
            />
          ) : null}
        </>
      )}
    </div>
  );
};

export default RecurseTile;
