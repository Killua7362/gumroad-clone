import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import { productPageCollaboratorsSchemaType } from './_layout_products.collaborators';
import { ProductHomeRouteType } from './_layout_products.home';
export const Route = createFileRoute(
    '/_protected/_layout/products/_layout_products'
)({
    component: () => {
        return (
            <ProductLayout>
                <Outlet />
            </ProductLayout>
        );
    },
});

const ProductLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <header className="pt-4 py-8 sm:pt-8 border-b border-white/10">
                <h1 className="text-4xl font-bold text-white mb-6">Products</h1>
                <nav className="flex space-x-4">
                    <Link
                        to="/products/home"
                        search={(prev: ProductHomeRouteType) => ({
                            sort_by: prev.sort_by || 'title',
                            reverse: prev.reverse || false,
                            search_word: prev.search_word || '',
                            sort_bar_active: prev.sort_bar_active || false,
                        })}
                        className={`  no-underline ${location.pathname === '/products/home' ? 'text-white font-semibold' : 'text-white/80 hover:text-white '}`}>
                        Home
                    </Link>
                    <Link
                        to="/products/collaborators"
                        search={(prev: productPageCollaboratorsSchemaType) => ({
                            type: prev.type ?? 'outgoing',
                        })}
                        className={`  no-underline ${location.pathname === '/products/collaborators' ? 'text-white font-semibold' : 'text-white/80 hover:text-white '}`}>
                        Collaborators
                    </Link>
                </nav>
            </header>
            <main className="py-8">{children}</main>
        </div>
    );
};
