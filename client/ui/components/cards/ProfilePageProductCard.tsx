import { processProducts } from '@/lib/products_process';
import { Link } from '@tanstack/react-router';
import { Fragment } from 'react/jsx-runtime';

interface ProfilePageCardProps {
    name: string;
    url: string;
    profileProducts: Entries<ProductTypePayload>;
}

const ProfilePageProductCard = ({
    name,
    url,
    profileProducts,
}: ProfilePageCardProps) => {
    const getProducts = [
        ...processProducts({ products: profileProducts, searchURL: url }),
    ];

    return (
        getProducts.length > 0 && (
            <Fragment>
                <div className="text-xl">{name}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                    {getProducts.map(([key, value], i) => {
                        return (
                            <Link
                                className="w-[min(100%,23rem)] min-h-[20rem] no-underline text-white"
                                to="/profile/$id"
                                params={{ id: key }}
                                key={key}>
                                <div className="flex flex-col w-full h-full items-center justify-center gap-y-3 hover:border-white border-white/30 border-[0.1px] rounded-md p-5 cursor-pointer">
                                    <div className="h-full w-full bg-accent p-4 relative">
                                        <div className="absolute right-4">
                                            Pin
                                        </div>
                                    </div>
                                    <div className="w-full flex justify-between text-xl">
                                        <div>{value.title}</div>
                                        <div>5</div>
                                    </div>
                                    <div className="w-full">
                                        {value.summary}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </Fragment>
        )
    );
};
export default ProfilePageProductCard;
