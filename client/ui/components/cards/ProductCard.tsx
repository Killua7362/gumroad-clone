import { Link } from '@tanstack/react-router';
import { FaDotCircle } from 'react-icons/fa';
import { FaImage } from 'react-icons/fa6';
import { GoLink } from 'react-icons/go';

interface ProductCard {
    children: React.ReactNode;
    productData: ProductType;
}

const ProductCard = ({ children, productData }: ProductCard) => {
    const collabApproved = () => {
        return productData.collabs!.some((e) => e.approved === false);
    };

    return (
        <article className="flex flex-col flex-wrap sm:flex-row gap-y-4 gap-x-6 items-center border-white/30 border-[0.1px] rounded-xl p-6 relative min-w-fit max-w-[20rem] sm:max-w-[38rem] overflow-hidden">
            <section>
                {productData?.thumbimageSource &&
                productData?.thumbimageSource !== '' ? (
                    <img
                        src={productData.thumbimageSource!}
                        height={0}
                        width={0}
                        alt="image"
                        className="h-full w-full object-contain"
                    />
                ) : (
                    <FaImage className="text-[3rem] sm:text-[4rem] h-[3rem] w-[8rem]" />
                )}
            </section>
            <section className="flex flex-col justify-between gap-y-3">
                <header>
                    <Link
                        style={{
                            fontFamily: 'inherit',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                        }}
                        disabled={!productData.live}>
                        <h2 className="text-2xl tracking-wider flex gap-x-2 items-center">
                            {productData.title}
                        </h2>
                        {productData.live && (
                            <GoLink className="text-lg text-sky-400 cursor-pointer" />
                        )}
                    </Link>
                    <p className="text-white/70 text-lg tracking-wide font-thin text-justify">
                        {productData.summary || 'No summary'}
                    </p>
                </header>
                <footer className="grid gap-y-2">
                    <ul className="flex flex-wrap gap-x-3">
                        {productData.tags !== '' &&
                            productData.tags.split(',').map((e, i) => {
                                return (
                                    <li
                                        className="text-xs px-3 py-[0.2rem] bg-white text-black w-fit h-fit rounded-xl"
                                        key={`product_card_tags_${i}`}>
                                        {e}
                                    </li>
                                );
                            })}
                    </ul>
                    <ul className="flex gap-x-6 mt-1 text-sm">
                        <li
                            className={`${productData.live ? 'text-green-400' : 'text-red-400'}  flex items-center gap-x-1`}>
                            <FaDotCircle className="text-sm relative" />
                            Live
                        </li>
                        {productData.collab_active &&
                            productData.collabs?.length !== 0 && (
                                <li
                                    className={`${!collabApproved() ? 'text-green-400' : 'text-red-400'}  flex items-center gap-x-1 whitespace-nowrap`}>
                                    <FaDotCircle className="text-sm relative" />
                                    Collab Approved
                                </li>
                            )}
                    </ul>
                </footer>
            </section>
            {children}
        </article>
    );
};

export default ProductCard;
