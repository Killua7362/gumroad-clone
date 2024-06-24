import TilingRoot from '@/ui/components/tiling';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_protected/_layout/home/')({
  component: () => {
    return <Home />;
  },
});

const Home = () => {
  const initialTilingProps: TileRootProps = {
    render: {
      A: <div className="h-full w-full"></div>,
      B: <div className="h-full w-full"></div>,
      C: <div className="h-full w-full"></div>,
    },
    schema: {
      split: 60,
      tile: 'col',
      primary: 'A',
      secondary: {
        split: 50,
        tile: 'row',
        primary: 'C',
        secondary: 'D',
      },
    },
  };

  return (
    <div className="h-[100vh] w-full relative flex items-center overflow-hidden">
      <TilingRoot initialTilingProp={initialTilingProps} />
    </div>
  );
};
