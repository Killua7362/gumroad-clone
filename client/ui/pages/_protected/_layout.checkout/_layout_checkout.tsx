import Button from '@/ui/components/button';
import { Link, Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_protected/_layout/checkout/_layout_checkout'
)({
  component: () => {
    return (
      <CheckoutLayout>
        <Outlet />
      </CheckoutLayout>
    );
  },
});

const CheckoutLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="flex flex-col text-white/90 pb-5 pt-3 sm:pt-10 mr-4 gap-y-6">
        <div className="text-3xl sm:text-4xl uppercase tracking-wide ml-4">
          Checkout
        </div>
        <div className="border-b-[1px] h-5 border-white/30 flex gap-x-4 w-full">
          <Link
            to="/checkout/form"
            style={{
              textDecoration: 'none',
            }}
            activeProps={{
              className: 'cursor-default pointer-events-none',
            }}>
            {({ isActive }) => (
              <Button
                buttonName="Form"
                isActive={isActive}
                extraClasses={[`!text-base !rounded-2xl`]}
              />
            )}
          </Link>
          <Link
            to="/checkout/suggestions"
            style={{
              textDecoration: 'none',
            }}
            activeProps={{
              className: 'cursor-default pointer-events-none',
            }}>
            {({ isActive }) => (
              <Button
                buttonName="Suggest"
                isActive={isActive}
                extraClasses={[`!text-base !rounded-2xl`]}
              />
            )}
          </Link>
        </div>
      </div>
      <div className="text-xl flex flex-col lg:flex-row gap-4 relative left-0 top-4">
        {children}
      </div>
    </>
  );
};
