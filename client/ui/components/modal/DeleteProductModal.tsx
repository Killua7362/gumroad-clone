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
                <div
                    className="bg-background z-50 border-white/30 rounded-xl min-w-[15rem] border-[0.1px] p-6 text-lg flex flex-col gap-y-6 items-center"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}>
                    <div className="text-xl">Confirm Delete?</div>
                    <div className="flex gap-x-4">
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
                    </div>
                </div>
            </Modal.Base>
            <Modal.Open>
                <div
                    className="px-4 py-3 hover:bg-accent/50 cursor-pointer"
                    onClick={() => {
                        setContextMenuConfig((prev) => {
                            return { ...prev, active: false };
                        });
                    }}>
                    Delete
                </div>
            </Modal.Open>
        </Modal.Root>
    );
};
export default DeleteProductModal;
