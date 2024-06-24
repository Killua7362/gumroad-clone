const RecurseTile = ({
  render,
  schema,
  initialStyle,
}: {
  render?: TileRender;
  schema?: TileSchema;
  initialStyle: TileInitialStyle;
}) => {
  const primaryStyle = {
    width:
      schema?.secondary && schema?.tile === 'col'
        ? `${schema?.split}%`
        : '100%',
    height:
      schema?.secondary && schema?.tile === 'row'
        ? `${schema?.split}%`
        : '100%',
  };

  const secondaryStyle = {
    width:
      schema?.secondary && schema?.tile === 'col'
        ? `${schema?.split}%`
        : '100%',
    height:
      schema?.secondary && schema?.tile === 'row'
        ? `${schema?.split}%`
        : '100%',
  };

  return (
    <div
      className={`flex gap-x-2 gap-y-2 ${schema?.tile === 'row' ? 'flex-col' : 'flex-row'} text-black`}
      style={{
        height: initialStyle.height,
        width: initialStyle.width,
      }}>
      {typeof schema?.primary === 'string' ? (
        <div style={primaryStyle}>{render![schema.primary]}</div>
      ) : (
        <>
          {typeof schema?.primary === 'object' ? (
            <RecurseTile
              schema={schema?.primary}
              render={render}
              initialStyle={{
                width:
                  schema?.secondary && schema?.tile === 'col'
                    ? `${schema?.split}%`
                    : '100%',
                height:
                  schema?.secondary && schema?.tile === 'row'
                    ? `${schema?.split}%`
                    : '100%',
              }}
            />
          ) : null}
        </>
      )}
      {typeof schema?.secondary === 'string' ? (
        <div style={secondaryStyle}>{render![schema.secondary]}</div>
      ) : (
        <>
          {typeof schema?.secondary === 'object' ? (
            <RecurseTile
              schema={schema?.secondary}
              render={render}
              initialStyle={{
                width:
                  schema?.tile === 'col' ? `${100 - schema?.split}%` : '100%',
                height:
                  schema?.tile === 'row' ? `${100 - schema?.split}%` : '100%',
              }}
            />
          ) : null}
        </>
      )}
    </div>
  );
};

export default RecurseTile;
