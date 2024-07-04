import { renderNodeContext } from '@/ui/pages/_protected/_layout.home.index.lazy';
import { useContext, useState } from 'react';
import TileDragging from './dragging';
import TileCard from './tile_card';

interface TileInitialStyle {
    width: string;
    height: string;
}

interface RecurseTile {
    schema: TileSchema;
    initialStyle: TileInitialStyle;
}
const RecurseTile = ({ schema, initialStyle }: RecurseTile) => {
    const renderNode = useContext(renderNodeContext);

    const [primaryDragging, setPrimaryDragging] = useState(false);
    const [secondaryDragging, setSecondaryDragging] = useState(false);

    const primaryStyle = {
        width:
            !!schema?.secondary && !secondaryDragging && schema?.tile === 'col'
                ? !!schema?.primary && !primaryDragging
                    ? schema?.split + '%'
                    : '0'
                : !!schema?.primary
                  ? '100%'
                  : '0',
        height:
            !!schema?.secondary && !secondaryDragging && schema?.tile === 'row'
                ? !!schema?.primary && !primaryDragging
                    ? schema?.split + '%'
                    : '0'
                : !!schema?.primary
                  ? '100%'
                  : '0',
        border: '1px solid rgba(255,255,255,0.2)',
    };

    const secondaryStyle = {
        width:
            !!schema?.primary && !primaryDragging && schema?.tile === 'col'
                ? !!schema.secondary && !secondaryDragging
                    ? 100 - (schema?.split || 0) + '%'
                    : '0'
                : !!schema?.secondary
                  ? '100%'
                  : '0',
        height:
            !!schema?.primary && !primaryDragging && schema?.tile === 'row'
                ? !!schema.secondary && !secondaryDragging
                    ? 100 - (schema?.split || 0) + '%'
                    : '0'
                : !!schema?.secondary
                  ? '100%'
                  : '0',
        border: '1px solid rgba(255,255,255,0.2)',
    };

    const [recurseTileRef, setRecurseTileRef] = useState<HTMLElement>();

    return (
        (!!schema?.primary || !!schema?.secondary) && (
            <article
                className={`flex ${schema?.tile === 'row' ? 'flex-col' : 'flex-row'} text-black relative`}
                style={{
                    height: initialStyle.height,
                    width: initialStyle.width,
                }}
                ref={(newRef) => {
                    newRef && setRecurseTileRef(newRef);
                }}>
                {typeof schema?.primary === 'string' &&
                schema?.primary in renderNode! ? (
                    <TileCard
                        primaryStyle={primaryStyle}
                        name={schema.primary}
                        setDragging={setPrimaryDragging}
                        schemaID={schema.id!}
                    />
                ) : (
                    <>
                        {typeof schema?.primary === 'object' ? (
                            <RecurseTile
                                schema={schema.primary}
                                initialStyle={primaryStyle}
                            />
                        ) : null}
                    </>
                )}
                {recurseTileRef && !!schema?.primary && !!schema?.secondary && (
                    <TileDragging
                        schema={schema!}
                        parentBoundingBox={recurseTileRef.getBoundingClientRect()}
                    />
                )}
                {typeof schema?.secondary === 'string' &&
                schema?.secondary in renderNode! ? (
                    <TileCard
                        primaryStyle={secondaryStyle}
                        name={schema.secondary}
                        setDragging={setSecondaryDragging}
                        schemaID={schema.id!}
                    />
                ) : (
                    <>
                        {typeof schema?.secondary === 'object' ? (
                            <RecurseTile
                                schema={schema.secondary}
                                initialStyle={secondaryStyle}
                            />
                        ) : null}
                    </>
                )}
            </article>
        )
    );
};

export default RecurseTile;
