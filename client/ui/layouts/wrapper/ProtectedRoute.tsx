import { loginStatusFetcher } from '@/react-query/query';
import Loader from '@/ui/components/loader';
import { Navigate, Outlet } from '@tanstack/react-router';

const ProtectedRoute = () => {
  const {
    data: loginStatus,
    isSuccess: isLoginSuccess,
    isPending: isLoginStatusLoading,
  } = loginStatusFetcher();

  if (isLoginStatusLoading) return <Loader />;

  if (isLoginSuccess && loginStatus.logged_in === true) return <Outlet />;

  return <Navigate to="/signin" />;
};

export default ProtectedRoute;
