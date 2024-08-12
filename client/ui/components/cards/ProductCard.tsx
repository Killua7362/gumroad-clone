import preview from '@/media/images/preview.jpg';
import { Link } from '@tanstack/react-router';
import { FaDotCircle } from 'react-icons/fa';
import { GoLink } from 'react-icons/go';
import { IoMdSettings } from 'react-icons/io';

interface ProductCard {
    children: React.ReactNode;
    productData: ProductType;
    onSettingsClick: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => void;
}

const ProductCard = ({
    children,
    productData,
    onSettingsClick,
}: ProductCard) => {
    const collabApproved = () => {
        return productData.collabs!.some((e) => e.approved === false);
    };

    return (
        <article className="flex flex-col md:flex-row h-full border-white/30 border-[0.1px] rounded-xl overflow-hidden bg-background relative shadow-lg hover:shadow-xl transition-shadow duration-300">
            <section className="md:w-[45%] h-48 md:h-auto relative">
                <img
                    src={productData.thumbimageSource!}
                    onError={({ currentTarget }) => {
                        currentTarget.src = preview;
                    }}
                    alt={productData.title}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
            </section>
            <section className="flex flex-col flex-grow p-6 md:w-[55%]">
                <header className="mb-3">
                    <Link
                        className="group"
                        style={{
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.5rem',
                        }}
                        to="/profile/$id/product/$productid"
                        params={{
                            id: productData.user_id!,
                            productid: productData.product_id!,
                        }}
                        target="_blank"
                        rel="noopener noreferrer"
                        disabled={!productData.live}>
                        <h2
                            className={`text-2xl font-bold tracking-wide break-words text-white ${productData.live && 'group-hover:text-sky-400'} transition-colors duration-200`}>
                            {productData.title}
                        </h2>
                        {productData.live && (
                            <GoLink className="text-xl text-sky-400 cursor-pointer flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        )}
                    </Link>
                </header>
                <p className="text-gray-300 text-sm tracking-wide mb-4 flex-grow">
                    {productData.summary || 'No summary'}
                </p>
                <ul className="flex flex-wrap gap-2 mb-4 list-none">
                    {productData.tags !== '' &&
                        productData.tags.split(',').map((e, i) => (
                            <li
                                className="text-xs px-3 py-1 rounded-full mb-1 text-black bg-white transition-colors duration-200"
                                key={`product_card_tags_${i}`}>
                                {e}
                            </li>
                        ))}
                </ul>
                <footer className="mt-auto">
                    <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
                        <li
                            className={`${
                                productData.live
                                    ? 'text-green-400'
                                    : 'text-red-400'
                            } flex items-center gap-x-1 font-medium`}>
                            <FaDotCircle className="text-sm relative" />
                            Live
                        </li>
                        {productData.collab_active &&
                            productData.collabs?.length !== 0 && (
                                <li
                                    className={`${
                                        !collabApproved()
                                            ? 'text-green-400'
                                            : 'text-red-400'
                                    } flex items-center gap-x-1 whitespace-nowrap font-medium`}>
                                    <FaDotCircle className="text-sm relative" />
                                    Collab Approved
                                </li>
                            )}
                    </ul>
                </footer>
            </section>
            <button
                className="absolute top-3 right-3 text-white/70 hover:text-white text-xl cursor-pointer rounded-full p-2 transition-colors duration-200 bg-background"
                onClick={onSettingsClick}>
                <IoMdSettings />
            </button>
            {children}
        </article>
    );
};

export default ProductCard;
