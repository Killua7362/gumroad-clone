import TilingRoot from '@/ui/components/tiling';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_protected/_layout/home/')({
  component: () => {
    return <Home />;
  },
});

const Home = () => {
  const initialRender: TileRender = {
    A: <div className="h-full w-full"></div>,
    B: <div className="h-full w-full"></div>,
    C: <div className="h-full w-full"></div>,
    D: <div className="h-full w-full"></div>,
    E: <div className="h-full w-full"></div>,
  };

  const initialSchema: TileSchema = {
    split: 60,
    tile: 'col',
    primary: {
      split: 40,
      tile: 'row',
      primary: {
        split: 50,
        tile: 'col',
        primary: 'A',
        secondary: 'E',
      },
      secondary: 'B',
    },
    secondary: {
      split: 70,
      tile: 'col',
      primary: 'C',
      secondary: 'D',
    },
  };

  return (
    <div className="h-[100vh] w-full relative flex items-center overflow-hidden">
      <TilingRoot initialRender={initialRender} initialSchema={initialSchema} />
    </div>
  );
};
