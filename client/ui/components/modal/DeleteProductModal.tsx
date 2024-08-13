import { getProductDeleter } from '@/react-query/mutations';
import Button from '@/ui/components/button';
import * as Modal from '@/ui/components/modal';
import { ProductsCardContextMenu } from '@/ui/pages/_protected/_layout.products/_layout_products.home/index.lazy';
import { motion } from 'framer-motion';

interface DeleteProductModal {
    idx: string;
    setContextMenuConfig: React.Dispatch<
        React.SetStateAction<ProductsCardContextMenu>
    >;
}

const DeleteProductModal = ({
    idx,
    setContextMenuConfig,
}: DeleteProductModal) => {
    const { mutate: productDeleter, isPending: productIsDeleting } =
        getProductDeleter();

    return (
        <Modal.Root key={idx}>
            <Modal.Base>
                <article
                    className="bg-background z-50 border-white/30 rounded-xl min-w-[15rem] border-[0.1px] p-6 text-lg grid gap-y-6 text-center  m-[2rem]"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}>
                    <h2 className="text-xl">Confirm Delete?</h2>
                    <section className="flex gap-x-4">
                        <Modal.Close>
                            <Button buttonName="Cancel" />
                        </Modal.Close>
                        <Modal.Close>
                            <Button
                                buttonName="Confirm"
                                onClickHandler={() => {
                                    productDeleter(idx);
                                }}
                                variant="destructive"
                            />
                        </Modal.Close>
                    </section>
                </article>
            </Modal.Base>
            <Modal.Open>
                <motion.li
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
                    whileTap={{ scale: 0.95 }}>
                    <button
                        className={`w-full px-4 py-2 text-sm text-red-400 bg-background flex items-center gap-2 focus:outline-none hover:cursor-pointer hover:bg-background/80`}
                        onClick={() => {
                            setContextMenuConfig((prev) => {
                                return { ...prev, active: false };
                            });
                        }}>
                        Delete
                    </button>
                </motion.li>
            </Modal.Open>
        </Modal.Root>
    );
};
export default DeleteProductModal;
