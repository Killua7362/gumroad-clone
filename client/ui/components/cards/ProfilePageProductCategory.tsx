import { css, cx } from '@emotion/css';
import { Link, useParams } from '@tanstack/react-router';
import { Fragment } from 'react/jsx-runtime';
import ProductCard from './ProductCard';

interface ProfilePageCardProps {
    name: string;
    url: string;
    profileProducts: ProductType[];
    preview?: boolean;
}

const ProfilePageProductCard = ({
    name,
    url,
    profileProducts,
    preview = false,
}: ProfilePageCardProps) => {
    const params = preview ? undefined : useParams({ from: '/profile/$id/' });

    return (
        profileProducts.length > 0 && (
            <Fragment>
                <header>
                    <h2 className="text-2xl font-semibold text-white mb-4">
                        {name}
                    </h2>
                </header>
                <main
                    className={cx(
                        'mt-2 grid gap-6 px-4 mb-10 sm:px-8 sm:pr-6 sm:pl-4 md:pl-0',
                        css`
                        /* prettier-ignore */
                        ${`
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        @media (min-width: 768px) {
                          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                        }
                      `}
                    `
                    )}>
                    {profileProducts.map((value, i) => {
                        return (
                            <ProductCard
                                key={value.product_id}
                                productData={{
                                    ...value,
                                }}
                                layout="col">
                                <Link
                                    className="group cursor-pointer"
                                    style={{
                                        textDecoration: 'none',
                                    }}
                                    to="/profile/$id/product/$productid"
                                    params={{
                                        id: params?.id ?? value.user_id!,
                                        productid: value.product_id!,
                                    }}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    key={value.product_id}>
                                    <ProductCard.ImageSection />
                                    <section className="flex flex-col flex-grow p-6">
                                        <header className="mb-3">
                                            <ProductCard.TitleSection />
                                        </header>
                                        <ProductCard.SummarySection />
                                        <ProductCard.TagsSection />
                                    </section>
                                </Link>
                            </ProductCard>
                        );
                    })}
                </main>
            </Fragment>
        )
    );
};
export default ProfilePageProductCard;
