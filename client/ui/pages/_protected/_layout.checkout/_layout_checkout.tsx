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
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <header className="pt-4 py-8 sm:pt-8 border-b border-white/10">
                <h1 className="text-4xl font-bold text-white mb-6">Products</h1>
                <nav className="flex space-x-4">
                    <Link
                        to="/checkout/form"
                        style={{
                            textDecoration: 'none',
                        }}
                        className={`  no-underline ${location.pathname === '/checkout/form' ? 'text-white font-semibold' : 'text-white/80 hover:text-white '}`}>
                        Home
                    </Link>
                    <Link
                        to="/checkout/suggestions"
                        style={{
                            textDecoration: 'none',
                        }}
                        className={`  no-underline ${location.pathname === '/products/suggestions' ? 'text-white font-semibold' : 'text-white/80 hover:text-white '}`}>
                        Collaborators
                    </Link>
                </nav>
            </header>

            <main className="text-xl flex flex-col lg:flex-row gap-4 relative left-0 top-4">
                {children}
            </main>
        </div>
    );
};
