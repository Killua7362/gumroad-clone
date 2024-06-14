import { queryClient } from '@/app/RouteComponent';
import { loginStatusFetcherProps } from '@/react-query/query';
import Footer from '@/ui/components/Footer';
import SideBar from '@/ui/components/sidebar';
import Toast from '@/ui/components/toast';
import {
  createRootRoute,
  Outlet,
  useRouterState,
} from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import Bar from '../components/loader/Bar';
import SharedStore from '../misc/shared-storage';

const getSideBarProps = () => {
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(700);

  return {
    sideBarOpen,
    windowWidth,
    setSideBarOpen,
    setWindowWidth,
  } as SideBarProps;
};

export const Route = createRootRoute({
  loader: async () => {
    const loginStatus = await queryClient.ensureQueryData(
      loginStatusFetcherProps
    );
    const result = loginStatus as authSchema;
    return result;
  },
  component: () => {
    const { status, isLoading } = useRouterState();
    if (status === 'pending' || isLoading) {
      return <Bar />;
    } else {
      return (
        <>
          <SharedStore />
          <BaseLayout>
            <Outlet />
          </BaseLayout>
        </>
      );
    }
  },
});

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  const matches = useRouterState().matches;
  const lastMatchContext = matches[matches.length - 1].context;

  const sideBarActive = (lastMatchContext as RootContextProps).sidebaractive!;
  const sideBarProps: SideBarProps = getSideBarProps();

  return (
    <div className="min-h-screen min-w-screen flex flex-col sm:flex-row flex-wrap relative">
      <Toast />
      <AnimatePresence mode="wait" initial={false}>
        {(sideBarActive || false) && <SideBar {...sideBarProps} />}
      </AnimatePresence>
      <motion.div
        layout
        className={`absolute h-full w-full sm:w-auto flex flex-col justify-between overflow-y-auto overflow-x-auto sm:ml-8 sm:right-0 px-2 sm:px-0 scrollbar-thin scrollbar-thumb-white scrollbar-track-background top-[6rem] sm:top-0`}
        transition={{
          x: { type: 'spring', bounce: 0 },
        }}
        style={{
          left:
            (sideBarActive || false) && sideBarProps.windowWidth > 640
              ? sideBarProps.sideBarOpen
                ? '18rem'
                : '5rem'
              : 0,
        }}>
        <div>{children}</div>
        <Footer />
      </motion.div>
    </div>
  );
};
