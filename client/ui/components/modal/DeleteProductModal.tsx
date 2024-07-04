import { getProductDeleter } from '@/react-query/mutations';
import Button from '@/ui/components/button';
import * as Modal from '@/ui/components/modal';
import { ProductsCardContextMenu } from '@/ui/pages/_protected/_layout.products/_layout_products.home/index.lazy';

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
                <li
                    className="px-4 py-3 hover:bg-accent/50 cursor-pointer"
                    onClick={() => {
                        setContextMenuConfig((prev) => {
                            return { ...prev, active: false };
                        });
                    }}>
                    Delete
                </li>
            </Modal.Open>
        </Modal.Root>
    );
};
export default DeleteProductModal;
