import { hideToastState } from '@/atoms/states';
import { EditProductSchema } from '@/forms/schema/edit_product_schema';
import { getProductLiveToggle } from '@/react-query/mutations';
import { ProductsCardContextMenu } from '@/ui/pages/_protected/_layout.products/_layout_products.home/index.lazy';
import { Link } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { useSetRecoilState } from 'recoil';
import { z } from 'zod';
import DeleteProductModal from '../modal/DeleteProductModal';

interface ProductHomeContextMenu {
    contextMenuConfig: ProductsCardContextMenu;
    value: ProductType;
    setContextMenuConfig: React.Dispatch<
        React.SetStateAction<ProductsCardContextMenu>
    >;
}

const ProductHomeContextMenu = ({
    contextMenuConfig,
    value,
    setContextMenuConfig,
}: ProductHomeContextMenu) => {
    const { mutate: liveSetter } = getProductLiveToggle();

    const setToastRender = useSetRecoilState(hideToastState);

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-4 top-12 bg-gray-400 rounded-md shadow-lg overflow-hidden z-10"
                style={{
                    width: '150px',
                    display:
                        contextMenuConfig.active &&
                        contextMenuConfig.activeIdx === value.product_id!
                            ? 'grid'
                            : 'none',
                }}>
                <motion.ul className="py-1">
                    <motion.li
                        whileHover={{
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        }}
                        whileTap={{ scale: 0.95 }}>
                        <button
                            className={`w-full px-4 py-2 text-sm bg-background text-white flex items-center gap-2 focus:outline-none hover:cursor-pointer hover:bg-background/90`}
                            onClick={async () => {
                                try {
                                    EditProductSchema.parseAsync({
                                        ...value,
                                    });
                                    await liveSetter({
                                        key: value.product_id!,
                                        live: !value.live,
                                    });
                                } catch (e) {
                                    if (e instanceof z.ZodError) {
                                        setToastRender({
                                            active: false,
                                            message: 'Some fields are empty',
                                        });
                                    }
                                }

                                setContextMenuConfig((prev) => {
                                    return {
                                        ...prev,
                                        active: false,
                                    };
                                });
                            }}>
                            Go Live
                        </button>
                    </motion.li>
                    <motion.li
                        whileHover={{
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        }}
                        whileTap={{ scale: 0.95 }}>
                        <button
                            className={`w-full px-4 py-2 text-sm  bg-background text-white flex items-center gap-2 focus:outline-none hover:cursor-pointer hover:bg-background/90`}>
                            <Link
                                to={`/products/edit/${value.product_id!}/home`}
                                className="text-white no-underline">
                                Edit
                            </Link>
                        </button>
                    </motion.li>
                    <DeleteProductModal
                        idx={value.product_id!}
                        setContextMenuConfig={setContextMenuConfig}
                    />
                </motion.ul>
            </motion.div>
        </AnimatePresence>
    );
};

export default ProductHomeContextMenu;
