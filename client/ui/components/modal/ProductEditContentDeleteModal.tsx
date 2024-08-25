import Button from '@/ui/components/button';
import * as Modal from '@/ui/components/modal';
import { productEditContext } from '@/ui/pages/_protected/_layout.products.edit.$id/_layout_edit';
import { ProductContentSearchType } from '@/ui/pages/_protected/_layout.products.edit.$id/_layout_edit.content';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useContext } from 'react';
import { UseFieldArrayRemove } from 'react-hook-form';

interface ProductEditContentDeleteModal {
    i: number;
    remove: UseFieldArrayRemove;
    pagesLength: number;
}

const ProductEditContentDeleteModal = ({
    i,
    remove,
    pagesLength,
}: ProductEditContentDeleteModal) => {
    const navigate = useNavigate({ from: '/products/edit/$id/content' });

    const localProductEditContext = useContext(productEditContext);
    const { control, watch, setValue, getValues } = localProductEditContext!;
    const params = useSearch({
        from: '/_protected/_layout/products/edit/$id/_layout_edit/content/',
    });

    return (
        <Modal.Root key={i}>
            <Modal.Base>
                <article className="bg-background z-50 border-white/30 rounded-xl min-w-[15rem] border-[0.1px] p-6 text-lg grid gap-y-6 m-[2rem] text-center">
                    <header>
                        <h2 className="text-xl">Confirm Delete?</h2>
                    </header>
                    <section className="flex gap-x-4">
                        <Modal.Close>
                            <Button buttonName="Cancel" />
                        </Modal.Close>
                        <Modal.Close>
                            <Button
                                buttonName="Confirm"
                                onClickHandler={() => {
                                    remove(i);
                                    if (params.page === pagesLength) {
                                        navigate({
                                            search: (
                                                prev: ProductContentSearchType
                                            ) => ({
                                                ...prev,
                                                page: pagesLength - 1,
                                            }),
                                            state: {
                                                ...getValues(),
                                            },
                                            replace: true,
                                        });
                                    }
                                }}
                                variant="destructive"
                            />
                        </Modal.Close>
                    </section>
                </article>
            </Modal.Base>
            <Modal.Open>
                <li className="px-4 py-2 bg-background text-white cursor-pointer hover:bg-white/5 text-lg">
                    Delete
                </li>
            </Modal.Open>
        </Modal.Root>
    );
};

export default ProductEditContentDeleteModal;
