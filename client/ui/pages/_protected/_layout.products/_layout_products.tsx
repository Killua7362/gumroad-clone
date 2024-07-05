import Button from '@/ui/components/button';
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
        <>
            <header className="grid text-white/90 pb-5 pt-3 sm:pt-10 mr-4 gap-y-8">
                <h1 className="text-3xl sm:text-4xl uppercase tracking-wide ml-4">
                    Products
                </h1>
                <section className="border-b-[1px] h-5 border-white/30 flex gap-x-4">
                    <Link
                        to="/products/home"
                        search={(prev: ProductHomeRouteType) => ({
                            sort_by: prev.sort_by || 'title',
                            reverse: prev.reverse || false,
                            search_word: prev.search_word || '',
                            search_bar_active: prev.search_bar_active || false,
                            sort_bar_active: prev.sort_bar_active || false,
                        })}
                        style={{
                            textDecoration: 'none',
                        }}
                        activeProps={{
                            className: 'cursor-default pointer-events-none',
                        }}>
                        <Button
                            buttonName="Home"
                            isActive={location.pathname === '/products/home'}
                            extraClasses={[`!text-base !rounded-2xl`]}
                        />
                    </Link>
                    <Link
                        to="/products/collaborators"
                        search={(prev: productPageCollaboratorsSchemaType) => ({
                            type: 'outgoing',
                            ...prev,
                        })}
                        style={{
                            textDecoration: 'none',
                        }}
                        activeProps={{
                            className: 'cursor-default pointer-events-none',
                        }}>
                        <Button
                            buttonName="Collab"
                            isActive={
                                location.pathname === '/products/collaborators'
                            }
                            extraClasses={[`!text-base !rounded-2xl`]}
                        />
                    </Link>
                </section>
            </header>
            <section className="text-xl grid gap-4 relative left-0 top-6">
                {children}
            </section>
        </>
    );
};
