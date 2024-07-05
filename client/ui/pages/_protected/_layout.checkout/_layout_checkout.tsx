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
            <header className="grid gap-y-6 pt-10 py-6">
                <h1 className="text-3xl sm:text-4xl uppercase tracking-wide ml-4">
                    Checkout
                </h1>
                <section className="border-b-[1px] h-5 border-white/30 flex gap-x-4 w-full">
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
                </section>
            </header>
            <main>
                <article className="text-xl relative mt-4">{children}</article>
            </main>
        </>
    );
};
