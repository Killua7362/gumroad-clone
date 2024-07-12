import { processProducts } from '@/lib/products_process';
import { Link, useParams } from '@tanstack/react-router';
import { FaImage } from 'react-icons/fa';
import { Fragment } from 'react/jsx-runtime';

interface ProfilePageCardProps {
    name: string;
    url: string;
    profileProducts: Entries<ProductTypePayload>;
    preview?: boolean;
}

const ProfilePageProductCard = ({
    name,
    url,
    profileProducts,
    preview = false,
}: ProfilePageCardProps) => {
    const getProducts = [
        ...processProducts({ products: profileProducts, searchURL: url }),
    ];

    const params = preview ? undefined : useParams({ from: '/profile/$id/' });
    return (
        getProducts.length > 0 && (
            <Fragment>
                <header>
                    <h2 className="text-xl">{name}</h2>
                </header>
                <main
                    className="w-full"
                    style={{
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(auto-fit,minmax(200px,1fr))',
                        gridGap: '2rem',
                    }}>
                    {getProducts.map(([key, value], i) => {
                        return (
                            <Link
                                className="w-full h-full no-underline text-white"
                                to="/profile/$id/product/$productid"
                                params={{
                                    id: params?.id ?? key,
                                    productid: key,
                                }}
                                key={key}>
                                <article className="flex h-full flex-col xs:flex-row sm:flex-col gap-3 hover:border-white border-white/30 border-[0.1px] rounded-md p-5 cursor-pointer">
                                    <section className="w-full h-full">
                                        {value?.thumbimageSource &&
                                        value?.thumbimageSource !== '' ? (
                                            <img
                                                src={value.thumbimageSource!}
                                                height={0}
                                                width={0}
                                                alt="image"
                                                className="h-full w-full object-contain"
                                            />
                                        ) : (
                                            <FaImage className="text-[3rem] sm:text-[4rem] h-[3rem] w-[8rem]" />
                                        )}
                                    </section>
                                    <section className="flex flex-col gap-y-2 w-full h-full justify-between">
                                        <section className="flex flex-col gap-2">
                                            <section className="flex flex-row xs:flex-col sm:flex-row justify-between text-xl">
                                                <label>{value.title}</label>
                                                <label>5</label>
                                            </section>
                                            <p className="">{value.summary}</p>
                                        </section>
                                        <ul className="flex flex-wrap gap-x-3 mt-2">
                                            {value.tags !== '' &&
                                                value.tags
                                                    .split(',')
                                                    .map((e, i) => {
                                                        return (
                                                            <li
                                                                className="text-xs px-3 py-[0.2rem] bg-white text-black w-fit h-fit rounded-xl"
                                                                key={`product_card_tags_${i}`}>
                                                                {e}
                                                            </li>
                                                        );
                                                    })}
                                        </ul>
                                    </section>
                                </article>
                            </Link>
                        );
                    })}
                </main>
            </Fragment>
        )
    );
};
export default ProfilePageProductCard;
