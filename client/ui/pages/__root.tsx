import { queryClient } from '@/app/RouteComponent';
import { loginStatusFetcherProps } from '@/react-query/query';
import SideBar from '@/ui/components/sidebar';
import Toast from '@/ui/components/toast';
import {
    createRootRoute,
    Outlet,
    useRouterState,
} from '@tanstack/react-router';
import { useState } from 'react';
import Footer from '../components/Footer';
import Bar from '../components/loader/Bar';
import SharedStore from '../misc/shared-storage';

interface RootContextProps {
    sidebaractive: boolean;
}

export interface SideBarProps {
    sideBarOpen: boolean;
    windowWidth: number;
    setSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setWindowWidth: React.Dispatch<React.SetStateAction<number>>;
}

const getSideBarProps = (): SideBarProps => {
    const [sideBarOpen, setSideBarOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState<number>(700);

    return {
        sideBarOpen,
        windowWidth,
        setSideBarOpen,
        setWindowWidth,
    };
};

export const Route = createRootRoute({
    loader: async () => {
        const loginStatus: authSchema = await queryClient.ensureQueryData(
            loginStatusFetcherProps()
        );
        return loginStatus;
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
        <article className="min-h-screen min-w-screen flex flex-col sm:flex-row flex-wrap bg-background">
            <Toast />
            {(sideBarActive || false) && <SideBar {...sideBarProps} />}
            <div
                className={`absolute w-full min-h-screen sm:w-auto flex flex-col justify-between overflow-y-auto overflow-x-hidden md:mx-8 sm:right-0 px-2 sm:px-0 scrollbar-thin scrollbar-thumb-white scrollbar-track-background top-[5rem] sm:top-0`}
                style={{
                    left:
                        (sideBarActive || false) &&
                        sideBarProps.windowWidth > 640
                            ? sideBarProps.sideBarOpen
                                ? '18rem'
                                : '5rem'
                            : 0,
                }}>
                <section className="h-full relative mb-10">{children}</section>
                <Footer />
            </div>
        </article>
    );
};
