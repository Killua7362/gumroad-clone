import previewImg from '@/media/images/preview.jpg';
import { createContext, PropsWithChildren, useContext } from 'react';
import { IoMdSettings } from 'react-icons/io';

interface ProductCard {
    productData: ProductType;
    layout?: 'auto' | 'row' | 'col';
}

const localProductCardContext = createContext<ProductCard | null>(null);

const useProductCardContext = () => {
    const context = useContext(localProductCardContext);
    if (!context) {
        throw new Error(
            'Use Product Card Context must be used within product card context'
        );
    }
    return context;
};

const ProductCard = ({
    children,
    layout,
    productData,
}: ProductCard & PropsWithChildren) => {
    return (
        <localProductCardContext.Provider value={{ productData, layout }}>
            <article
                className={`flex bg-white/5 ${!layout || layout === 'auto' ? 'flex-col md:flex-row' : layout === 'col' ? 'flex-col' : 'flex-row'} h-full border-white/10 border-[0.1px] rounded-xl overflow-hidden bg-background relative shadow-lg hover:shadow-xl transition-shadow duration-300`}>
                {children}
            </article>
        </localProductCardContext.Provider>
    );
};

ProductCard.TitleSection = () => {
    const { productData } = useProductCardContext();
    return (
        <h2
            className={`text-2xl font-bold tracking-wide break-words ${productData.live ? 'group-hover:text-sky-400 text-white' : 'text-gray-300'}`}>
            {productData.title}{' '}
        </h2>
    );
};

ProductCard.ImageSection = () => {
    const { productData, layout } = useProductCardContext();
    return (
        <section
            className={`${!layout || layout === 'auto' ? 'md:w-[45%] h-48 md:h-auto' : layout === 'col' ? 'h-48' : 'w-[45%] h-auto'} relative`}>
            <img
                src={productData.thumbimageSource!}
                onError={({ currentTarget }) => {
                    currentTarget.src = previewImg;
                }}
                alt={productData.title}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
        </section>
    );
};

ProductCard.SummarySection = () => {
    const { productData } = useProductCardContext();
    return (
        <p className="text-gray-300 text-sm tracking-wide mb-4 flex-grow">
            {productData.summary || 'No summary'}
        </p>
    );
};
ProductCard.Review = () => {
    return <div>5</div>;
};

ProductCard.TagsSection = () => {
    const { productData } = useProductCardContext();
    return (
        <div className="flex flex-wrap gap-2 mb-2">
            {productData.tags !== '' &&
                productData.tags.split(',').map((tag, i) => (
                    <span
                        key={`product_card_tags_${i}`}
                        className="text-xs px-2 py-1 bg-indigo-600 text-white rounded-full">
                        {tag.trim()}
                    </span>
                ))}
        </div>
    );
};

ProductCard.StatusSection = () => {
    const { productData } = useProductCardContext();
    const collabApproved = () => {
        return productData.collabs!.some((e) => e.approved === false);
    };

    return (
        <footer className="mt-auto">
            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs mt-2">
                <li
                    className={`${
                        productData.live ? 'text-green-400' : 'text-red-400'
                    } flex items-center gap-x-1 font-medium`}>
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
                            Collab Approved
                        </li>
                    )}
            </ul>
        </footer>
    );
};

interface ProductCardContextMenu {
    onSettingsClick: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => void;
}
ProductCard.ContextMenu = ({ onSettingsClick }: ProductCardContextMenu) => {
    return (
        <button
            className="absolute top-3 right-3 text-white/70 hover:text-white text-xl cursor-pointer rounded-full p-2  bg-[#181A1A]"
            onClick={onSettingsClick}>
            <IoMdSettings />
        </button>
    );
};

export default ProductCard;
