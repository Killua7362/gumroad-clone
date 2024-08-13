import { CableContext } from '@/app/ActionCableContext';
import { queryClient } from '@/app/RouteComponent';
import { allProductsIndexStatus } from '@/atoms/states';
import { loginStatusFetcherProps } from '@/react-query/query';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useContext, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

export const Route = createFileRoute('/_protected/_layout')({
    beforeLoad: async () => {
        try {
            const loginStatus: authSchema = await queryClient.ensureQueryData(
                loginStatusFetcherProps()
            );
            if (loginStatus.logged_in === false) {
                throw 'Not Logged in';
            }
            return {
                sidebaractive: true,
            };
        } catch (err) {
            throw redirect({
                to: '/signin',
            });
        }
    },
    component: () => {
        const cableContext = useContext(CableContext);
        const setIndexed = useSetRecoilState(allProductsIndexStatus);

        // const userId = (queryClient.getQueryData(['loginStatus']) as authSchema)
        //     .user_id;
        useEffect(() => {
            cableContext!.cable.subscriptions.create(
                {
                    channel: 'AsyncQueryChannel',
                    // user_id: userId,
                },
                {
                    // connected: () => console.log('connected'),
                    // disconnected: () => console.log('disconnected'),
                    received: (data) => {
                        setIndexed(data.indexed);
                        if (data.indexed === false) {
                            // queryClient.invalidateQueries({
                            //     queryKey: ['collabProducts'],
                            // });
                        }
                    },
                }
            );

            return () => cableContext!.cable.disconnect();
        }, []);

        return <Outlet />;
    },
});
