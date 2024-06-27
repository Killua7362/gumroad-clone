import { useState } from 'react';
import TileDragging from './dragging';
import TileCard from './tile_card';

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

  const [primaryDragging, setPrimaryDragging] = useState(false);
  const [secondaryDragging, setSecondaryDragging] = useState(false);

  const primaryStyle = {
    width:
      schema?.secondary && !secondaryDragging && schema?.tile === 'col'
        ? schema?.primary && !primaryDragging
          ? schema?.split + '%'
          : '0'
        : schema?.primary
          ? '100%'
          : '0',
    height:
      schema?.secondary && !secondaryDragging && schema?.tile === 'row'
        ? schema?.primary && !primaryDragging
          ? schema?.split + '%'
          : '0'
        : schema?.primary
          ? '100%'
          : '0',
    border: '1px solid white',
  };

  const secondaryStyle = {
    width:
      schema?.primary && !primaryDragging && schema?.tile === 'col'
        ? schema.secondary && !secondaryDragging
          ? 100 - (schema?.split || 0) + '%'
          : '0'
        : schema?.secondary
          ? '100%'
          : '0',
    height:
      schema?.primary && !primaryDragging && schema?.tile === 'row'
        ? schema.secondary && !secondaryDragging
          ? 100 - (schema?.split || 0) + '%'
          : '0'
        : schema?.secondary
          ? '100%'
          : '0',
    border: '1px solid white',
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
        <TileCard
          primaryStyle={primaryStyle}
          renderChild={render![schema.primary]}
          name={schema.primary}
          setDragging={setPrimaryDragging}
        />
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
        <TileCard
          primaryStyle={secondaryStyle}
          renderChild={render![schema.secondary]}
          name={schema.secondary}
          setDragging={setSecondaryDragging}
        />
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
