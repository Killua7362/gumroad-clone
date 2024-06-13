import { queryClient } from '@/app/RouteComponent';
import { loginStatusFetcherProps } from '@/react-query/query';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_nonprotected/_layout')({
  beforeLoad: async () => {
    const loginStatus: authSchema = await queryClient.ensureQueryData(
      loginStatusFetcherProps
    );
    if (loginStatus.logged_in === true) {
      throw redirect({
        to: '/',
      });
    }
  },
});
