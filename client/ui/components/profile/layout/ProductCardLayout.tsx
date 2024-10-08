import { allProductsFetcher } from '@/react-query/query';
import { ProductsCardContextMenu } from '@/ui/pages/_protected/_layout.products/_layout_products.home/index.lazy';
import { css, cx } from '@emotion/css';
import { Link, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import ProductCard from '../../cards/ProductCard';
import ProductHomeContextMenu from '../../context/ProductHomeContextMenu';

interface ProductCardLayout {
    data: ProductType[];
}
const ProductCardLayout = ({ data }: ProductCardLayout) => {
    const [contextMenuConfig, setContextMenuConfig] =
        useState<ProductsCardContextMenu>({
            active: false,
            activeIdx: '-1',
        });
    const params = useSearch({
        from: '/_protected/_layout/products/_layout_products/home/',
    });
    const { data: allProductsData } = allProductsFetcher({
        initialData: data,
        reverse: params.reverse,
        sort_by: params.sort_by,
        search_word: params.search_word!,
    });

    useEffect(() => {
        const closeContextMenu = () => {
            setContextMenuConfig({
                active: false,
                activeIdx: '0',
            });
        };
        document.body.addEventListener('click', closeContextMenu);
        return () =>
            document.body.removeEventListener('click', closeContextMenu);
    }, []);

    const handleSettingsClick = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        productId: string
    ) => {
        event.stopPropagation(); // Prevent the click from bubbling up
        setContextMenuConfig((prev) => ({
            active: !prev.active || prev.activeIdx !== productId,
            activeIdx: productId,
        }));
    };
    return (
        <section
            className={cx(
                'mt-2 grid gap-6 px-4 mb-10 sm:px-8 sm:pr-6 sm:pl-4 md:pl-0',
                css`
                        /* prettier-ignore */
                        ${`
                        grid-template-columns: repeat(1, 1fr);
                        @media (min-width: 768px) {
                            grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
                        }
                      `}
                                `
            )}>
            {allProductsData.map((value, i) => {
                return (
                    <ProductCard
                        key={value.product_id}
                        productData={{
                            ...value,
                        }}>
                        <ProductCard.ImageSection />
                        <section className="flex flex-col flex-grow p-6 md:w-[55%]">
                            <header className="mb-3">
                                <Link
                                    className="group"
                                    style={{
                                        textDecoration: 'none',
                                    }}
                                    to="/profile/$id/product/$productid"
                                    params={{
                                        id: value.user_id!,
                                        productid: value.product_id!,
                                    }}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    disabled={!value.live}>
                                    <ProductCard.TitleSection />
                                </Link>
                            </header>
                            <ProductCard.SummarySection />
                            <ProductCard.TagsSection />
                            <ProductCard.StatusSection />
                        </section>
                        <ProductCard.ContextMenu
                            onSettingsClick={(
                                event: React.MouseEvent<
                                    HTMLButtonElement,
                                    MouseEvent
                                >
                            ) => handleSettingsClick(event, value.product_id!)}
                        />
                        <ProductHomeContextMenu
                            contextMenuConfig={contextMenuConfig}
                            setContextMenuConfig={setContextMenuConfig}
                            value={value}
                        />
                    </ProductCard>
                );
            })}
        </section>
    );
};

export default ProductCardLayout;
